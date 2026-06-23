(function () {
  const HASH = '2650cb41c2f8e768df762d23bc74a86872f38145926e79ca360bc46b58685f8c';

  const blockStyle = document.createElement('style');
  blockStyle.id = '_auth_block';
  blockStyle.textContent = 'body{visibility:hidden!important}';
  document.currentScript.parentElement.appendChild(blockStyle);

  async function sha256(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function reveal() {
    const s = document.getElementById('_auth_block');
    if (s) s.remove();
  }

  function showModal() {
    const style = document.createElement('style');
    style.id = '_auth_style';
    style.textContent = `
      #_auth_overlay{position:fixed;inset:0;z-index:99999;background:rgba(24,34,47,.72);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center}
      #_auth_modal{background:#fff;border-radius:16px;padding:40px 36px;width:340px;max-width:90vw;box-shadow:0 8px 40px rgba(24,34,47,.18);text-align:center;font-family:'Noto Sans JP',sans-serif}
      #_auth_icon{margin-bottom:14px}
      #_auth_icon svg{width:40px;height:40px}
      #_auth_title{font-size:20px;font-weight:700;color:#18222f;margin:0 0 8px}
      #_auth_desc{font-size:13px;color:#566472;margin:0 0 24px}
      #_auth_input{width:100%;box-sizing:border-box;padding:10px 14px;font-size:15px;border:1.5px solid #dce4ea;border-radius:8px;outline:none;margin-bottom:12px;transition:border-color .2s;font-family:inherit}
      #_auth_input:focus{border-color:#0f7b8a}
      #_auth_btn{width:100%;padding:11px;font-size:15px;font-weight:700;color:#fff;background:#0f7b8a;border:none;border-radius:8px;cursor:pointer;transition:background .2s;font-family:inherit}
      #_auth_btn:hover{background:#0a525d}
      #_auth_err{font-size:13px;color:#c0392b;margin:10px 0 0;min-height:18px}
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.id = '_auth_overlay';
    overlay.innerHTML = `
      <div id="_auth_modal">
        <div id="_auth_icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="#0f7b8a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h2 id="_auth_title">アクセス制限</h2>
        <p id="_auth_desc">このページを閲覧するにはパスワードが必要です</p>
        <input type="password" id="_auth_input" placeholder="パスワードを入力" autocomplete="current-password" />
        <button id="_auth_btn">確認</button>
        <p id="_auth_err"></p>
      </div>
    `;
    document.body.appendChild(overlay);
    reveal();
    document.getElementById('_auth_input').focus();

    async function attempt() {
      const val = document.getElementById('_auth_input').value;
      if (!val) return;
      const h = await sha256(val);
      if (h === HASH) {
        sessionStorage.setItem('_auth', HASH);
        overlay.remove();
        style.remove();
      } else {
        document.getElementById('_auth_err').textContent = 'パスワードが違います';
        document.getElementById('_auth_input').value = '';
        document.getElementById('_auth_input').focus();
      }
    }

    document.getElementById('_auth_btn').addEventListener('click', attempt);
    document.getElementById('_auth_input').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') attempt();
    });
  }

  function init() {
    if (sessionStorage.getItem('_auth') === HASH) {
      reveal();
    } else {
      showModal();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
