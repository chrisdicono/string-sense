class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header>
        <nav>
          <ul class="nav-left">
            <li><a href="./index.html" class="logo">StringSense</a></li>
            <li><a href="./game.html">Play Game</a></li>
            <li><a href="./profile.html">Profile</a></li>
            <li><a href="./leaderboard.html">Leaderboard</a></li>
          </ul>
          <ul class="nav-right">
            <li><a href="./signup.html">Log In/Sign Up</a></li>
          </ul>
        </nav>
      </header>
    `;
  }
}

customElements.define('site-header', SiteHeader);

class SiteFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
          <footer>
            <p>&copy; 2025 Christopher DiCono. All rights reserved.</p>
          </footer>
        `;
    }
}

customElements.define('site-footer', SiteFooter);

class HeadContents extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
          <meta charset="UTF-8">
          <title>StringSense</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Ancizar+Serif:ital,wght@0,300..900;1,300..900&family=DynaPuff:wght@400..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
        `;
    }
}

customElements.define('head-contents', HeadContents);