/**
 * 增强的主题切换器 - 支持深空模式和纯净模式
 */

interface ThemeConfig {
    name: string;
    displayName: string;
    icon: string;
}

class ThemeSwitcher {
    private themes: ThemeConfig[] = [
        { name: 'light', displayName: '亮色模式', icon: '☀️' },
        { name: 'dark', displayName: '暗色模式', icon: '🌙' },
        { name: 'deep-space', displayName: '深空模式', icon: '🌌' },
        { name: 'pure', displayName: '纯净模式', icon: '✨' }
    ];

    private currentTheme: string;
    private toggleButton: HTMLElement | null;
    private themeMenu: HTMLElement | null;

    constructor() {
        this.currentTheme = this.getStoredTheme() || 'deep-space';
        this.init();
    }

    private init(): void {
        this.createThemeToggle();
        this.applyTheme(this.currentTheme);
        this.bindEvents();
    }

    private getStoredTheme(): string | null {
        return localStorage.getItem('theme');
    }

    private storeTheme(theme: string): void {
        localStorage.setItem('theme', theme);
    }

    private createThemeToggle(): void {
        // 查找现有的主题切换按钮
        this.toggleButton = document.querySelector('#dark-mode-toggle');
        
        if (!this.toggleButton) {
            // 如果没有找到，创建新的
            this.toggleButton = document.createElement('button');
            this.toggleButton.id = 'theme-toggle';
            this.toggleButton.className = 'theme-toggle-btn';
            
            // 添加到侧边栏
            const sidebar = document.querySelector('.left-sidebar');
            if (sidebar) {
                sidebar.appendChild(this.toggleButton);
            }
        }

        this.createThemeMenu();
        this.updateToggleButton();
    }

    private createThemeMenu(): void {
        this.themeMenu = document.createElement('div');
        this.themeMenu.className = 'theme-menu';
        this.themeMenu.innerHTML = `
            <div class="theme-menu-content">
                ${this.themes.map(theme => `
                    <button class="theme-option" data-theme="${theme.name}">
                        <span class="theme-icon">${theme.icon}</span>
                        <span class="theme-name">${theme.displayName}</span>
                    </button>
                `).join('')}
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .theme-toggle-btn {
                position: relative;
                background: var(--card-background);
                border: 1px solid var(--card-separator-color);
                border-radius: 8px;
                padding: 8px 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                margin: 10px;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                color: var(--card-text-color-main);
            }

            .theme-toggle-btn:hover {
                background: var(--card-background-selected);
                transform: translateY(-2px);
            }

            .theme-menu {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--card-background);
                border: 1px solid var(--card-separator-color);
                border-radius: 8px;
                box-shadow: var(--shadow-l2);
                z-index: 1000;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                margin-top: 5px;
            }

            .theme-menu.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .theme-menu-content {
                padding: 8px;
            }

            .theme-option {
                width: 100%;
                background: none;
                border: none;
                padding: 10px 12px;
                cursor: pointer;
                border-radius: 6px;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: all 0.2s ease;
                color: var(--card-text-color-main);
                font-size: 14px;
            }

            .theme-option:hover {
                background: var(--card-background-selected);
            }

            .theme-option.active {
                background: var(--accent-color);
                color: var(--accent-color-text);
            }

            .theme-icon {
                font-size: 16px;
            }

            [data-scheme="deep-space"] .theme-toggle-btn {
                box-shadow: 0 0 10px rgba(100, 255, 218, 0.2);
            }

            [data-scheme="deep-space"] .theme-menu {
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(100, 255, 218, 0.1);
            }

            [data-scheme="pure"] .theme-menu {
                backdrop-filter: blur(5px);
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
        `;
        document.head.appendChild(style);

        if (this.toggleButton) {
            this.toggleButton.appendChild(this.themeMenu);
        }
    }

    private updateToggleButton(): void {
        if (!this.toggleButton) return;

        const currentThemeConfig = this.themes.find(t => t.name === this.currentTheme);
        if (currentThemeConfig) {
            this.toggleButton.innerHTML = `
                <span class="theme-icon">${currentThemeConfig.icon}</span>
                <span class="theme-name">${currentThemeConfig.displayName}</span>
                <span class="dropdown-arrow">▼</span>
                ${this.themeMenu?.outerHTML || ''}
            `;
        }

        // 重新获取菜单引用
        this.themeMenu = this.toggleButton.querySelector('.theme-menu');
        this.updateActiveTheme();
    }

    private updateActiveTheme(): void {
        if (!this.themeMenu) return;

        const options = this.themeMenu.querySelectorAll('.theme-option');
        options.forEach(option => {
            const themeElement = option as HTMLElement;
            if (themeElement.dataset.theme === this.currentTheme) {
                themeElement.classList.add('active');
            } else {
                themeElement.classList.remove('active');
            }
        });
    }

    private bindEvents(): void {
        if (!this.toggleButton) return;

        // 切换菜单显示
        this.toggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.themeMenu) {
                this.themeMenu.classList.toggle('show');
            }
        });

        // 点击外部关闭菜单
        document.addEventListener('click', () => {
            if (this.themeMenu) {
                this.themeMenu.classList.remove('show');
            }
        });

        // 主题选择
        if (this.themeMenu) {
            this.themeMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                const target = e.target as HTMLElement;
                const themeOption = target.closest('.theme-option') as HTMLElement;
                
                if (themeOption && themeOption.dataset.theme) {
                    this.switchTheme(themeOption.dataset.theme);
                    this.themeMenu?.classList.remove('show');
                }
            });
        }

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.cycleTheme();
            }
        });
    }

    private switchTheme(theme: string): void {
        this.currentTheme = theme;
        this.applyTheme(theme);
        this.storeTheme(theme);
        this.updateToggleButton();
        this.showThemeNotification(theme);
    }

    private cycleTheme(): void {
        const currentIndex = this.themes.findIndex(t => t.name === this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.switchTheme(this.themes[nextIndex].name);
    }

    private applyTheme(theme: string): void {
        document.documentElement.setAttribute('data-scheme', theme);
        
        // 添加过渡效果
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    private showThemeNotification(theme: string): void {
        const themeConfig = this.themes.find(t => t.name === theme);
        if (!themeConfig) return;

        // 移除现有通知
        const existingNotification = document.querySelector('.theme-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // 创建新通知
        const notification = document.createElement('div');
        notification.className = 'theme-notification';
        notification.innerHTML = `
            <span class="notification-icon">${themeConfig.icon}</span>
            <span class="notification-text">已切换到${themeConfig.displayName}</span>
        `;

        // 添加通知样式
        const style = document.createElement('style');
        style.textContent = `
            .theme-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--card-background);
                border: 1px solid var(--card-separator-color);
                border-radius: 8px;
                padding: 12px 16px;
                display: flex;
                align-items: center;
                gap: 8px;
                z-index: 10000;
                box-shadow: var(--shadow-l2);
                animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
                color: var(--card-text-color-main);
                font-size: 14px;
            }

            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }

            [data-scheme="deep-space"] .theme-notification {
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(100, 255, 218, 0.1);
            }

            [data-scheme="pure"] .theme-notification {
                backdrop-filter: blur(5px);
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // 3秒后自动移除
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 3000);
    }
}

// 初始化主题切换器
document.addEventListener('DOMContentLoaded', () => {
    new ThemeSwitcher();
});

// 导出供其他模块使用
if (typeof window !== 'undefined') {
    (window as any).ThemeSwitcher = ThemeSwitcher;
}