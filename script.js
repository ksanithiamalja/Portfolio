/* ==========================================================================
   GLOBAL SETUP & STATE
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavbar();
    initCursorGlow();
    initTerminal();
    initSandbox();
    initContactForm();
});

/* ==========================================================================
   THEME MANAGER
   ========================================================================== */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    let currentTheme = savedTheme || (systemPrefersLight ? 'light' : 'dark');
    htmlElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', () => {
        const targetTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', targetTheme);
        localStorage.setItem('theme', targetTheme);
        
        // If sandbox is initialized, redraw the chart canvas with theme-specific colors
        if (typeof window.redrawChart === 'function') {
            window.redrawChart();
        }
    });
}

/* ==========================================================================
   NAVBAR & RESPONSIVE DRAWER
   ========================================================================== */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile drawer toggle
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });
}

/* ==========================================================================
   CURSOR MOUSE GLOW EFFECT
   ========================================================================== */
function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    // Follow speed coefficient
    const speed = 0.08;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateGlowPosition() {
        // Linear interpolation for smooth lag effect
        currentX += (mouseX - currentX) * speed;
        currentY += (mouseY - currentY) * speed;
        
        glow.style.left = `${currentX}px`;
        glow.style.top = `${currentY}px`;
        
        requestAnimationFrame(updateGlowPosition);
    }
    
    updateGlowPosition();
}

/* ==========================================================================
   INTERACTIVE DEVELOPER TERMINAL
   ========================================================================== */
function initTerminal() {
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalWidget = document.getElementById('terminal-widget');
    const terminalBody = document.getElementById('terminal-body');

    // Focus input on widget click
    terminalWidget.addEventListener('click', () => {
        terminalInput.focus();
    });

    // Auto-scroll terminal helper
    const scrollToBottom = () => {
        terminalBody.scrollTop = terminalBody.scrollHeight;
    };

    // Commands database
    const commands = {
        help: () => `
Available Commands:
  <span class="text-accent">about</span>      - Learn about Sanithi's background and focus.
  <span class="text-accent">skills</span>     - View technical skill metrics.
  <span class="text-accent">projects</span>   - List featured developer projects.
  <span class="text-accent">java-api</span>   - Deep dive details on the Java coursework API.
  <span class="text-accent">contact</span>    - Display professional contact links.
  <span class="text-accent">clear</span>      - Clear terminal console screen.
        `.trim(),
        
        about: () => `
Sanithi Amalja - Computer Science undergraduate at the University of Westminster.
Pivoting towards <span class="text-accent">Artificial Intelligence and Machine Learning</span>.
Learning methodology: Hands-on code-first. Rather than skimming theory, 
Sanithi builds architectures from scratch, debugging runtime errors sequentially.
        `.trim(),
        
        skills: () => `
Technical Matrix:
  * <span class="text-accent">Languages:</span> Java, Python, SQL, JavaScript
  * <span class="text-accent">Frameworks:</span> Spring Boot (RESTful design), Scikit-Learn
  * <span class="text-accent">AI & Data:</span> PyTorch (Deep Learning fundamentals), Pandas, NumPy
  * <span class="text-accent">Environments:</span> Jupyter Notebooks, VS Code, Git, CMD/Shell
        `.trim(),
        
        projects: () => `
Featured Projects:
  1. <span class="text-accent">Java Backend REST API</span> - Full Java API built from scratch for coursework.
  2. <span class="text-accent">Classical ML Jupyter Sandbox</span> - Regression and Classification notebook algorithms.
  3. <span class="text-accent">Deep Learning Foundations</span> - Matrix activations and backpropagation models.
Type <span class="text-accent">java-api</span> to inspect details of the Java project.
        `.trim(),
        
        "java-api": () => `
Project Deep-Dive: [Java Backend REST API]
  * <span class="text-accent">Context:</span> Coursework reassessment done under tight schedule constraints.
  * <span class="text-accent">Challenge:</span> Zero prior experience in Java.
  * <span class="text-accent">Approach:</span> Code-first. Developed a functional REST API, handled HTTP endpoints,
    requests/responses, and routing, learning OOP structures and Java syntax on the fly.
  * <span class="text-accent">Outcome:</span> Working API, high grade, and robust Java/backend knowledge foundations.
        `.trim(),
        
        contact: () => `
Connect with Sanithi:
  * <span class="text-accent">Email:</span> <a href="mailto:sanithiamalja@gmail.com" class="text-accent">sanithiamalja@gmail.com</a>
  * <span class="text-accent">LinkedIn:</span> <a href="https://linkedin.com/in/sanithi-amalja" target="_blank" class="text-accent">linkedin.com/in/sanithi-amalja</a>
        `.trim(),
        
        clear: () => {
            terminalOutput.innerHTML = '';
            return '';
        }
    };

    // Command Input Listener
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const inputVal = terminalInput.value.trim().toLowerCase();
            terminalInput.value = '';

            if (inputVal === '') return;

            // Log command in prompt format
            const promptLine = document.createElement('div');
            promptLine.className = 'terminal-line';
            promptLine.innerHTML = `<span class="terminal-prompt">guest@amalja-dev:~$</span> <span>${inputVal}</span>`;
            terminalOutput.appendChild(promptLine);

            // Execute command
            let result = '';
            if (commands[inputVal]) {
                result = commands[inputVal]();
            } else {
                result = `bash: command not found: <span class="text-error">${inputVal}</span>. Type <span class="text-accent">help</span> for choices.`;
            }

            if (result !== '') {
                const responseLine = document.createElement('div');
                responseLine.className = 'terminal-line';
                responseLine.style.whiteSpace = 'pre-wrap';
                responseLine.innerHTML = result;
                terminalOutput.appendChild(responseLine);
            }

            scrollToBottom();
        }
    });
}

/* ==========================================================================
   AI/ML INTERACTIVE SANDBOX
   ========================================================================== */
function initSandbox() {
    // Hyperparameters Elements
    const paramLr = document.getElementById('param-lr');
    const valLr = document.getElementById('val-lr');
    const paramEpochs = document.getElementById('param-epochs');
    const valEpochs = document.getElementById('val-epochs');
    const paramActivation = document.getElementById('param-activation');
    const paramDataset = document.getElementById('param-dataset');
    
    // Control Buttons
    const btnTrain = document.getElementById('btn-train');
    const btnReset = document.getElementById('btn-reset');
    
    // Metric Elements
    const metricEpoch = document.getElementById('metric-epoch');
    const metricLoss = document.getElementById('metric-loss');
    const metricAcc = document.getElementById('metric-acc');
    
    // Network SVG and Nodes
    const svg = document.getElementById('network-lines-svg');
    const inputNodes = document.querySelectorAll('.input-node');
    const hiddenNodes = document.querySelectorAll('.hidden-node');
    const outputNodes = document.querySelectorAll('.output-node');
    
    // Live Chart Canvas setup
    const canvas = document.getElementById('live-chart');
    const ctx = canvas.getContext('2d');
    
    // Simulation state
    let isTraining = false;
    let currentEpoch = 0;
    let lossHistory = [];
    let accHistory = [];
    let trainingInterval = null;
    let connections = [];

    // Set slider value readouts
    paramLr.addEventListener('input', () => valLr.textContent = paramLr.value);
    paramEpochs.addEventListener('input', () => valEpochs.textContent = paramEpochs.value);

    // Dynamic sizing helper for Chart Canvas
    function resizeCanvas() {
        const container = canvas.parentNode;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawChart();
    }
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        drawNetworkLines();
    });

    // Make global redraw trigger for theme transitions
    window.redrawChart = () => {
        drawChart();
    };

    /* Network Lines SVG Creation */
    function drawNetworkLines() {
        svg.innerHTML = '';
        connections = [];
        const svgRect = svg.getBoundingClientRect();
        
        if (svgRect.width === 0) return; // Prevent hidden node coordinates

        // Connect Input layer to Hidden layer
        inputNodes.forEach((inpNode) => {
            const inpRect = inpNode.getBoundingClientRect();
            const x1 = inpRect.left - svgRect.left + inpRect.width / 2;
            const y1 = inpRect.top - svgRect.top + inpRect.height / 2;

            hiddenNodes.forEach((hidNode) => {
                const hidRect = hidNode.getBoundingClientRect();
                const x2 = hidRect.left - svgRect.left + hidRect.width / 2;
                const y2 = hidRect.top - svgRect.top + hidRect.height / 2;

                const line = createSVGLine(x1, y1, x2, y2);
                svg.appendChild(line);
                connections.push({ element: line, type: 'ih' });
            });
        });

        // Connect Hidden layer to Output layer
        hiddenNodes.forEach((hidNode) => {
            const hidRect = hidNode.getBoundingClientRect();
            const x1 = hidRect.left - svgRect.left + hidRect.width / 2;
            const y1 = hidRect.top - svgRect.top + hidRect.height / 2;

            outputNodes.forEach((outNode) => {
                const outRect = outNode.getBoundingClientRect();
                const x2 = outRect.left - svgRect.left + outRect.width / 2;
                const y2 = outRect.top - svgRect.top + outRect.height / 2;

                const line = createSVGLine(x1, y1, x2, y2);
                svg.appendChild(line);
                connections.push({ element: line, type: 'ho' });
            });
        });
    }

    function createSVGLine(x1, y1, x2, y2) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('class', 'connection-line');
        return line;
    }

    /* Live Chart Drawing Logic */
    function drawChart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
        const gridColor = isLightTheme ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.05)';
        const textColor = isLightTheme ? '#625f7a' : '#9c99b6';
        const accentSecondary = getComputedStyle(document.documentElement).getPropertyValue('--accent-secondary').trim();
        const accentPrimary = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim();

        // 1. Draw Grid Lines
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        
        // Vertical lines
        const numVLines = 5;
        for (let i = 0; i <= numVLines; i++) {
            const x = (canvas.width / numVLines) * i;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        // Horizontal lines
        const numHLines = 4;
        for (let i = 0; i <= numHLines; i++) {
            const y = (canvas.height / numHLines) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // 2. Draw Curves if we have history
        const epochsLimit = parseInt(paramEpochs.value);
        const paddingLeft = 15;
        const paddingRight = 15;
        const paddingTop = 15;
        const paddingBottom = 15;
        
        const graphWidth = canvas.width - paddingLeft - paddingRight;
        const graphHeight = canvas.height - paddingTop - paddingBottom;

        if (lossHistory.length > 0) {
            // Plot Loss History (accentSecondary)
            ctx.strokeStyle = accentSecondary;
            ctx.lineWidth = 2.5;
            ctx.shadowBlur = 4;
            ctx.shadowColor = accentSecondary;
            ctx.beginPath();

            lossHistory.forEach((loss, idx) => {
                const ratioX = idx / (epochsLimit - 1 || 1);
                const x = paddingLeft + ratioX * graphWidth;
                
                // Loss capped around 1.5, normalized to height
                const normalizedLoss = Math.min(loss / 1.5, 1.0);
                const y = canvas.height - paddingBottom - (normalizedLoss * graphHeight);
                
                if (idx === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();
            
            // Plot Accuracy History (accentPrimary)
            ctx.strokeStyle = accentPrimary;
            ctx.lineWidth = 2.5;
            ctx.shadowBlur = 4;
            ctx.shadowColor = accentPrimary;
            ctx.beginPath();

            accHistory.forEach((acc, idx) => {
                const ratioX = idx / (epochsLimit - 1 || 1);
                const x = paddingLeft + ratioX * graphWidth;
                
                // Accuracy between 0.0 and 1.0
                const y = canvas.height - paddingBottom - (acc * graphHeight);
                
                if (idx === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();
            
            // Clear shadows
            ctx.shadowBlur = 0;
        } else {
            // Draw placeholder text when empty
            ctx.fillStyle = textColor;
            ctx.font = '12px var(--font-sans)';
            ctx.textAlign = 'center';
            ctx.fillText('Press "Run Training Session" to plot live data curves', canvas.width / 2, canvas.height / 2);
        }
    }

    /* Training Simulation Math */
    function startTraining() {
        isTraining = true;
        btnTrain.disabled = true;
        btnReset.disabled = true;
        
        // Read hyperparameters
        const lr = parseFloat(paramLr.value);
        const maxEpochs = parseInt(paramEpochs.value);
        const activation = paramActivation.value;
        const dataset = paramDataset.value;

        // Initialize curves from current points (if resume-able, but we clear for new runs)
        if (currentEpoch === 0) {
            lossHistory = [];
            accHistory = [];
        }

        // Fire signals visual effect toggle
        inputNodes.forEach(node => node.classList.add('firing'));
        hiddenNodes.forEach(node => node.classList.add('firing'));
        outputNodes.forEach(node => node.classList.add('firing'));
        connections.forEach(conn => conn.element.classList.add('firing'));

        trainingInterval = setInterval(() => {
            currentEpoch++;
            
            // Core ML convergence math model based on choices
            // Models curves with actual mathematical noise & speed characteristics
            let targetLoss = 0.03;
            let targetAcc = 0.98;
            let lrModifier = lr * 10.0; // Higher LR converges faster, but could overshoot
            
            if (dataset === 'circle') {
                targetLoss = 0.08;
                targetAcc = 0.95;
            } else if (dataset === 'sine') {
                targetLoss = 0.04;
                targetAcc = 0.97;
            }

            // Activation coefficient speed
            let activationSpeed = 1.0;
            if (activation === 'sigmoid') activationSpeed = 0.6; // Sigmoid van. gradients
            if (activation === 'tanh') activationSpeed = 0.85;

            // Hyperparameter influence curves
            const epochRatio = currentEpoch / maxEpochs;
            const convergenceRate = epochRatio * lrModifier * activationSpeed;
            
            // Loss formula (Exponential decay with random batch-size noise)
            const randomNoise = (Math.random() - 0.5) * 0.03 * (1 - epochRatio);
            let loss = Math.max(targetLoss, 1.0 * Math.exp(-convergenceRate * 3.5) + randomNoise);
            
            // In case of extremely high LR, trigger instability
            if (lr > 0.15) {
                const instability = Math.sin(currentEpoch * 0.8) * 0.05 * (epochRatio);
                loss += instability;
            }

            // Accuracy formula (S-curve logarithmic growth with random variations)
            let acc = Math.min(targetAcc, 0.4 + (targetAcc - 0.4) * (1 - Math.exp(-convergenceRate * 4)) + randomNoise * 0.2);

            lossHistory.push(loss);
            accHistory.push(acc);

            // Update UI Numbers
            metricEpoch.textContent = `${currentEpoch} / ${maxEpochs}`;
            metricLoss.textContent = loss.toFixed(4);
            metricAcc.textContent = `${(acc * 100).toFixed(2)}%`;

            // Draw current step on Chart
            drawChart();

            // End execution condition
            if (currentEpoch >= maxEpochs) {
                stopTraining();
            }
        }, 50); // Fast interactive steps
    }

    function stopTraining() {
        clearInterval(trainingInterval);
        isTraining = false;
        
        btnTrain.disabled = true;
        btnReset.disabled = false;
        
        // Remove firing visual state from nodes and paths
        inputNodes.forEach(node => node.classList.remove('firing'));
        hiddenNodes.forEach(node => node.classList.remove('firing'));
        outputNodes.forEach(node => node.classList.remove('firing'));
        connections.forEach(conn => conn.element.classList.remove('firing'));
    }

    function resetSandbox() {
        stopTraining();
        currentEpoch = 0;
        lossHistory = [];
        accHistory = [];
        
        metricEpoch.textContent = `0 / ${paramEpochs.value}`;
        metricLoss.textContent = '0.0000';
        metricAcc.textContent = '0.00%';
        
        btnTrain.disabled = false;
        btnReset.disabled = true;
        
        drawChart();
    }

    // Connect trigger buttons
    btnTrain.addEventListener('click', () => {
        if (!isTraining) {
            startTraining();
        }
    });

    btnReset.addEventListener('click', resetSandbox);

    // Initial setup routines
    setTimeout(() => {
        drawNetworkLines();
        resizeCanvas();
    }, 100);
}

/* ==========================================================================
   SKILLS HOVER - PROJECT HIGHLIGHT CONNECTION
   ========================================================================== */
// This logic links skill tags to project cards visually on user hover.
const skillItems = document.querySelectorAll('.skill-item');
const projectCards = document.querySelectorAll('.project-card');

skillItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        const associatedProject = item.getAttribute('data-project');
        
        projectCards.forEach(card => {
            const cardStatus = card.querySelector('.project-tag-status').textContent.toLowerCase();
            
            // Check matching rules
            let isMatch = false;
            if (associatedProject === 'java-api' && card.querySelector('.project-title').textContent.includes('Java')) {
                isMatch = true;
            } else if (associatedProject === 'classical-ml' && card.querySelector('.project-title').textContent.includes('Classical')) {
                isMatch = true;
            } else if (associatedProject === 'deep-learning' && card.querySelector('.project-title').textContent.includes('Deep')) {
                isMatch = true;
            } else if (associatedProject === 'general') {
                isMatch = true; // Highlight all projects
            }

            if (isMatch) {
                card.classList.add('highlighted');
            } else {
                card.classList.add('dimmed');
            }
        });
    });

    item.addEventListener('mouseleave', () => {
        projectCards.forEach(card => {
            card.classList.remove('highlighted', 'dimmed');
        });
    });
});

/* ==========================================================================
   CONTACT FORM SUBMISSION HANDLER
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('portfolio-contact-form');
    const successAlert = document.getElementById('form-success-alert');
    const submitBtn = document.getElementById('btn-submit-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show button loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending Message...';

        // Simulate network API post call (since it's a static build)
        setTimeout(() => {
            // Show Success Overlay Panel
            successAlert.classList.add('show');
            form.reset();
            
            // Auto hide success overlay after 4 seconds and restore form access
            setTimeout(() => {
                successAlert.classList.remove('show');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }, 4000);
        }, 1200);
    });
}
