<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/add', label: 'Add Words' },
    { href: '/train', label: 'Train' },
    { href: '/stats', label: 'Stats' }
  ];
</script>

<div class="min-h-screen flex flex-col">
  <nav class="navbar bg-base-200 shadow-lg">
    <div class="flex-1">
      <a href="/" class="btn btn-ghost text-xl font-bold">
        <span class="text-primary">⚡</span> Blitz
      </a>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
        {#each navLinks as link}
          <li>
            <a
              href={link.href}
              class={$page.url.pathname === link.href ? 'active' : ''}
            >
              {link.label}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </nav>

  <main class="flex-1 container mx-auto px-4 py-8 max-w-6xl">
    <slot />
  </main>

  <footer class="footer footer-center p-4 bg-base-200 text-base-content">
    <div>
      <p>Blitz — Learn faster. Remember longer.</p>
    </div>
  </footer>
</div>
