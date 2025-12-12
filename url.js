    <!-- ========== COPY FROM HERE FOR WIDGET.JS ========== -->
    <script>
        // ========== WIDGET CODE START ==========
        (function() {
            'use strict';
            
            // Configuration (can be overridden by setting window.URLShortenerConfig)
            const defaultConfig = {
                buttonImage: 'https://trejduu32-code.github.io/effective-journey/url.jpeg',
                position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
                apiEndpoint: 'https://tinyurl.com/api-create.php'
            };
            
            const config = Object.assign({}, defaultConfig, window.URLShortenerConfig || {});
            
            // Inject required Tailwind CSS if not already present
            function injectTailwind() {
                if (!document.querySelector('script[src*="tailwindcss"]')) {
                    const script = document.createElement('script');
                    script.src = 'https://cdn.tailwindcss.com';
                    document.head.appendChild(script);
                }
            }
            
            // Inject widget styles
            function injectStyles() {
                const styleId = 'url-shortener-widget-styles';
                if (document.getElementById(styleId)) return;
                
                const style = document.createElement('style');
                style.id = styleId;
                style.textContent = `
                    .url-widget-glass {
                        background: rgba(15, 23, 42, 0.95);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                    }
                    .url-widget-glow {
                        box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
                    }
                    .url-widget-animated-bg {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    }
                    @keyframes url-widget-slide-up {
                        from { transform: translateY(20px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                    .url-widget-slide-up {
                        animation: url-widget-slide-up 0.3s ease-out;
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Create widget HTML
            function createWidget() {
                const positionClasses = {
                    'bottom-right': 'bottom-6 right-6',
                    'bottom-left': 'bottom-6 left-6',
                    'top-right': 'top-6 right-6',
                    'top-left': 'top-6 left-6'
                };
                
                const container = document.getElementById('urlShortenerWidgetContainer') || document.body;
                
                const widgetHTML = `
                    <div id="urlShortenerWidget" class="fixed ${positionClasses[config.position] || positionClasses['bottom-right']} z-50" style="z-index: 999999;">
                        <!-- Widget Panel -->
                        <div id="urlWidgetPanel" class="hidden mb-4 url-widget-glass rounded-2xl p-6 w-80 shadow-2xl url-widget-slide-up">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-white font-bold text-base">Quick URL Shortener</h3>
                                <button id="urlWidgetClose" class="text-gray-400 hover:text-white transition-colors">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>
                            
                            <form id="urlWidgetForm" class="space-y-3">
                                <input 
                                    type="url" 
                                    id="urlWidgetInput" 
                                    placeholder="https://example.com/long-url" 
                                    required
                                    class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                >
                                <button 
                                    type="submit"
                                    id="urlWidgetSubmit"
                                    class="w-full py-2 px-4 url-widget-animated-bg text-white font-semibold rounded-lg hover:scale-105 transform transition-all duration-300 text-sm"
                                >
                                    Shorten URL
                                </button>
                            </form>
                            
                            <div id="urlWidgetResult" class="mt-4 hidden">
                                <div class="bg-white/10 rounded-lg p-3 space-y-2">
                                    <p class="text-xs text-gray-400">Shortened URL:</p>
                                    <div class="flex gap-2">
                                        <a id="urlWidgetShortUrl" href="#" target="_blank" class="flex-1 text-purple-400 font-mono text-xs break-all hover:text-purple-300 transition-colors"></a>
                                        <button 
                                            id="urlWidgetCopy"
                                            class="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs transition-all flex-shrink-0"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div id="urlWidgetError" class="mt-4 hidden">
                                <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                    <p class="text-red-400 text-xs" id="urlWidgetErrorMsg"></p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Widget Button -->
                        <button 
                            id="urlWidgetButton"
                            class="w-16 h-16 rounded-full shadow-2xl hover:scale-110 transform transition-all duration-300 url-widget-glow overflow-hidden bg-gray-900 border-2 border-red-500"
                            title="Quick URL Shortener - Click to open"
                        >
                            <img 
                                src="${config.buttonImage}" 
                                alt="URL Shortener"
                                class="w-full h-full object-cover"
                                onerror="this.parentElement.innerHTML='<span class=\"text-2xl\">🔗</span>'"
                            >
                        </button>
                    </div>
                `;
                
                container.insertAdjacentHTML('beforeend', widgetHTML);
            }
            
            // Widget functionality
            function initializeWidget() {
                const panel = document.getElementById('urlWidgetPanel');
                const button = document.getElementById('urlWidgetButton');
                const closeBtn = document.getElementById('urlWidgetClose');
                const form = document.getElementById('urlWidgetForm');
                const input = document.getElementById('urlWidgetInput');
                const submitBtn = document.getElementById('urlWidgetSubmit');
                const resultDiv = document.getElementById('urlWidgetResult');
                const errorDiv = document.getElementById('urlWidgetError');
                const shortUrlLink = document.getElementById('urlWidgetShortUrl');
                const copyBtn = document.getElementById('urlWidgetCopy');
                const errorMsg = document.getElementById('urlWidgetErrorMsg');
                
                // Toggle panel
                function togglePanel() {
                    if (panel.classList.contains('hidden')) {
                        panel.classList.remove('hidden');
                        button.classList.add('scale-95');
                        input.focus();
                    } else {
                        panel.classList.add('hidden');
                        button.classList.remove('scale-95');
                        form.reset();
                        resultDiv.classList.add('hidden');
                        errorDiv.classList.add('hidden');
                    }
                }
                
                button.addEventListener('click', togglePanel);
                closeBtn.addEventListener('click', togglePanel);
                
                // Form submission
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const url = input.value.trim();
                    
                    if (!url) return;
                    
                    // Show loading state
                    submitBtn.textContent = 'Shortening...';
                    submitBtn.disabled = true;
                    errorDiv.classList.add('hidden');
                    
                    // Call API
                    const apiUrl = config.apiEndpoint + '?url=' + encodeURIComponent(url);
                    
                    fetch(apiUrl)
                        .then(response => {
                            if (!response.ok) throw new Error('Failed to shorten URL');
                            return response.text();
                        })
                        .then(shortUrl => {
                            // Show result
                            shortUrlLink.href = shortUrl;
                            shortUrlLink.textContent = shortUrl;
                            resultDiv.classList.remove('hidden');
                            errorDiv.classList.add('hidden');
                            
                            // Reset button
                            submitBtn.textContent = 'Shorten URL';
                            submitBtn.disabled = false;
                            
                            // Clear input
                            form.reset();
                        })
                        .catch(error => {
                            // Show error
                            errorMsg.textContent = error.message || 'Invalid URL. Please try again.';
                            errorDiv.classList.remove('hidden');
                            resultDiv.classList.add('hidden');
                            
                            // Reset button
                            submitBtn.textContent = 'Shorten URL';
                            submitBtn.disabled = false;
                        });
                });
                
                // Copy to clipboard
                copyBtn.addEventListener('click', function() {
                    const url = shortUrlLink.textContent;
                    
                    navigator.clipboard.writeText(url)
                        .then(() => {
                            const originalText = copyBtn.textContent;
                            copyBtn.textContent = 'Copied!';
                            copyBtn.classList.add('bg-green-600');
                            copyBtn.classList.remove('bg-purple-600');
                            
                            setTimeout(() => {
                                copyBtn.textContent = originalText;
                                copyBtn.classList.remove('bg-green-600');
                                copyBtn.classList.add('bg-purple-600');
                            }, 2000);
                        })
                        .catch(err => {
                            console.error('Failed to copy:', err);
                            alert('Failed to copy URL');
                        });
                });
            }
            
            // Initialize on DOM ready
            function init() {
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', function() {
                        injectTailwind();
                        injectStyles();
                        createWidget();
                        initializeWidget();
                    });
                } else {
                    injectTailwind();
                    injectStyles();
                    createWidget();
                    initializeWidget();
                }
            }
            
            // Start the widget
            init();
            
        })();
        // ========== WIDGET CODE END ==========
    </script>

    <!-- ========== COPY TO HERE FOR WIDGET.JS ========== -->

