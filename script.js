// ===== Utility Functions =====
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: '<i class="fas fa-check-circle"></i>',
        error: '<i class="fas fa-exclamation-circle"></i>',
        info: '<i class="fas fa-info-circle"></i>'
    };

    toast.innerHTML = `${icons[type] || icons.info} <span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, duration);
}

function createConfetti() {
    const container = document.getElementById('confettiContainer');
    if (!container) return;
    
    container.innerHTML = '';
    const colors = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

    for (let i = 0; i < 80; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.width = (Math.random() * 8 + 4) + 'px';
        piece.style.height = (Math.random() * 8 + 4) + 'px';
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        piece.style.animationDelay = (Math.random() * 2) + 's';
        piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
        container.appendChild(piece);
    }

    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

function createRipple(e, element) {
    if (!element) return;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

function typeWriter(element, text, speed = 30) {
    return new Promise(resolve => {
        if (!element) return resolve();
        element.textContent = '';
        let i = 0;
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                resolve();
            }
        }
        type();
    });
}

// ===== Initial Scenarios & Data =====
const emailScenarios = [
    {
        from: 'noreply@amazon-security.com',
        subject: 'Your Amazon account has been locked',
        body: `<p>Dear Customer,</p>
               <p>We have detected unusual activity on your account. Your account has been temporarily locked for security reasons.</p>
               <p>Please click the link below to verify your identity and restore access:</p>
               <p><a href="#" class="email-link">https://amazon.com-verify-account.net/secure</a></p>
               <p>If you do not verify within 24 hours, your account will be permanently deleted.</p>
               <p>Amazon Security Team</p>`,
        isPhishing: true,
        explanation: "This is phishing! Red flags: suspicious domain (amazon.com-verify-account.net), urgency tactic ('24 hours'), and generic greeting."
    },
    {
        from: 'security@paypa1.com',
        subject: 'Urgent: Account Suspended',
        body: `<p>Dear User,</p>
               <p>Your PayPal account has been limited due to suspicious activity.</p>
               <p>Click here to confirm your identity: <a href="#" class="email-link">https://paypa1.com/verify</a></p>
               <p>Failure to respond will result in permanent account closure.</p>
               <p>PayPal Security</p>`,
        isPhishing: true,
        explanation: "This is phishing! Red flags: misspelled domain (paypa1.com), creates false urgency, and asks to click suspicious link."
    },
    {
        from: 'noreply@github.com',
        subject: 'New sign-in to your GitHub account',
        body: `<p>Hi there,</p>
               <p>A new sign-in was detected on your GitHub account from Chrome on Windows.</p>
               <p><strong>Location:</strong> San Francisco, CA, USA</p>
               <p><strong>IP Address:</strong> 192.168.1.1</p>
               <p>If this was you, you can ignore this email. If not, please review your account security.</p>
               <p><a href="#" class="email-link">https://github.com/settings/security</a></p>
               <p>GitHub Security Team</p>`,
        isPhishing: false,
        explanation: "This appears legitimate! It uses the correct domain (github.com), provides specific details, and links to the official site."
    },
    {
        from: 'support@micros0ft.com',
        subject: 'Action Required: Unusual sign-in activity',
        body: `<p>Dear Microsoft User,</p>
               <p>We noticed an unusual sign-in to your Microsoft account from an unknown device.</p>
               <p><a href="#" class="email-link">https://micros0ft.com/security/verify</a></p>
               <p>Please verify your account immediately to prevent suspension.</p>
               <p>Microsoft Account Team</p>`,
        isPhishing: true,
        explanation: "This is phishing! Red flags: misspelled domain (micros0ft.com), urgency tactic, and suspicious link."
    },
    {
        from: 'security@apple.apple.com',
        subject: 'Your Apple ID was used to sign in',
        body: `<p>Your Apple ID was used to sign in to iCloud on a new device.</p>
               <p><strong>Device:</strong> iPhone 15 Pro</p>
               <p><strong>Location:</strong> Cupertino, CA</p>
               <p><strong>Time:</strong> April 24, 2026 at 10:30 AM PDT</p>
               <p>If this was you, no action is needed. If not, visit <a href="#" class="email-link">https://appleid.apple.com</a> to secure your account.</p>
               <p>Apple Support</p>`,
        isPhishing: false,
        explanation: "This appears legitimate! Correct domain (apple.com), specific details, and official Apple ID URL."
    }
];

const quizQuestions = [
    {
        question: "You receive an email from your bank asking you to verify your account by clicking a link. What should you do?",
        answers: ["Click the link and enter your credentials immediately", "Ignore it and hope it goes away", "Contact your bank directly using the number on your card", "Forward the email to all your friends to warn them"],
        correct: 2,
        explanation: "Always contact your bank directly using official channels. Never click links in unsolicited emails."
    },
    {
        question: "Which of the following is the strongest password?",
        answers: ["Password123!", "MyDog'sName2024", "Xk9#mP2$vL@qR5!", "qwerty"],
        correct: 2,
        explanation: "A strong password uses a mix of uppercase, lowercase, numbers, and special characters with no predictable patterns."
    },
    {
        question: "What does 'HTTPS' in a URL indicate?",
        answers: ["The website is faster", "The connection is encrypted", "The website is free to use", "The website is hosted in the US"],
        correct: 1,
        explanation: "HTTPS (HyperText Transfer Protocol Secure) means the data between your browser and the website is encrypted."
    },
    {
        question: "You find a USB drive in the parking lot at work. What should you do?",
        answers: ["Plug it in to see who it belongs to", "Give it to IT security without plugging it in", "Keep it for personal use", "Throw it in the trash"],
        correct: 1,
        explanation: "USB drives can contain malware. Always hand them to IT security professionals who can safely inspect them."
    },
    {
        question: "What is Two-Factor Authentication (2FA)?",
        answers: ["Using two different passwords", "A security method requiring two different types of verification", "Logging in from two different devices", "Having two email accounts"],
        correct: 1,
        explanation: "2FA requires something you know (password) plus something you have (phone/app) or something you are (fingerprint)."
    }
];

// App State
let currentScenario = 0;
let currentQuestion = 0;
let score = 0;
let userAnswers = [];

// Initialize App when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Selection Helpers
    const env = {
        // Navigation
        navbar: document.querySelector('.navbar'),
        navLinks: document.querySelectorAll('.nav-links a'),
        hamburger: document.querySelector('.hamburger'),
        scrollTopBtn: document.getElementById('scrollTop'),
        // Password Tools
        passwordInput: document.getElementById('passwordInput'),
        togglePassword: document.getElementById('togglePassword'),
        strengthBar: document.getElementById('strengthBar'),
        strengthLabel: document.getElementById('strengthLabel'),
        crackTimeDisplay: document.getElementById('crackTime'),
        passwordSuggestions: document.getElementById('passwordSuggestions'),
        generatePasswordBtn: document.getElementById('generatePassword'),
        // Password Generator Tool
        generatedPasswordSpan: document.querySelector('#generatedPassword span'),
        copyPasswordBtn: document.getElementById('copyPassword'),
        passwordLengthSlider: document.getElementById('passwordLength'),
        lengthValue: document.getElementById('lengthValue'),
        generateNewPasswordBtn: document.getElementById('generateNewPassword'),
        // Breach Checker
        breachEmailInput: document.getElementById('breachEmail'),
        checkBreachBtn: document.getElementById('checkBreach'),
        breachResult: document.getElementById('breachResult'),
        // Quiz
        quizStart: document.getElementById('quizStart'),
        quizQuestionSection: document.getElementById('quizQuestion'),
        quizResult: document.getElementById('quizResult'),
        startQuizBtn: document.getElementById('startQuiz'),
        restartQuizBtn: document.getElementById('restartQuiz'),
        // Modals
        privacyModal: document.getElementById('privacyModal'),
        termsModal: document.getElementById('termsModal'),
        contactForm: document.getElementById('contactForm')
    };

    // ===== Navigation Logic =====
    if (env.navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                env.navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            } else {
                env.navbar.style.background = 'rgba(15, 23, 42, 0.8)';
            }
            if (env.scrollTopBtn) {
                env.scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
            }
        });
    }

    if (env.hamburger) {
        env.hamburger.addEventListener('click', () => {
            env.hamburger.classList.toggle('active');
            document.querySelector('.nav-links').classList.toggle('mobile-open');
        });
    }

    env.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (env.hamburger) env.hamburger.classList.remove('active');
            document.querySelector('.nav-links').classList.remove('mobile-open');
        });
    });

    // ===== Scroll Animations & Counters =====
    const counters = document.querySelectorAll('.stat-number');
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                    scrollObserver.unobserve(entry.target);
                } else {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    scrollObserver.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.threat-card, .tip-card, .tool-card, .stat-number').forEach(el => {
        if (!el.classList.contains('stat-number')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
        scrollObserver.observe(el);
    });

    function animateCounter(el) {
        const target = parseFloat(el.getAttribute('data-target'));
        const duration = 2000;
        const start = performance.now();
        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const current = target * progress;
            el.textContent = target % 1 !== 0 ? current.toFixed(1) : Math.floor(current);
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target;
        }
        requestAnimationFrame(update);
    }

    // ===== Password Checker Logic =====
    if (env.passwordInput) {
        env.passwordInput.addEventListener('input', (e) => {
            checkPasswordStrength(e.target.value);
        });
    }

    if (env.togglePassword && env.passwordInput) {
        env.togglePassword.addEventListener('click', () => {
            const type = env.passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            env.passwordInput.setAttribute('type', type);
            env.togglePassword.querySelector('i').className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        });
    }

    if (env.generatePasswordBtn) {
        env.generatePasswordBtn.addEventListener('click', async (e) => {
            createRipple(e, env.generatePasswordBtn);
            const pass = generateCustomPassword(16, true, true, true, true);
            env.passwordInput.value = pass;
            checkPasswordStrength(pass);
            showToast("Strong password generated!", "success");
        });
    }

    // ===== Password Generator Tool Logic =====
    if (env.passwordLengthSlider) {
        env.passwordLengthSlider.addEventListener('input', (e) => {
            if (env.lengthValue) env.lengthValue.textContent = e.target.value;
        });
    }

    if (env.generateNewPasswordBtn) {
        env.generateNewPasswordBtn.addEventListener('click', async (e) => {
            createRipple(e, env.generateNewPasswordBtn);
            const length = parseInt(env.passwordLengthSlider.value);
            const pass = generateCustomPassword(
                length,
                document.getElementById('includeUpper').checked,
                document.getElementById('includeLower').checked,
                document.getElementById('includeNumbers').checked,
                document.getElementById('includeSpecial').checked
            );
            if (env.generatedPasswordSpan) {
                env.generatedPasswordSpan.textContent = pass;
                env.generatedPasswordSpan.classList.add('has-password');
                showToast("New password generated!", "success");
            }
        });
    }

    // ===== Breach Checker Logic =====
    if (env.checkBreachBtn) {
        env.checkBreachBtn.addEventListener('click', async (e) => {
            createRipple(e, env.checkBreachBtn);
            const email = env.breachEmailInput.value.trim();
            if (!email || !email.includes('@')) {
                showToast("Invalid email address", "error");
                return;
            }

            env.checkBreachBtn.disabled = true;
            env.checkBreachBtn.innerHTML = '<span class="btn-spinner"></span> Checking...';
            
            await new Promise(r => setTimeout(r, 1500));
            
            const isBreached = email.length % 3 === 0;
            env.breachResult.style.display = 'block';
            env.breachResult.className = `breach-result ${isBreached ? 'breached' : 'safe'} show`;
            
            if (isBreached) {
                env.breachResult.innerHTML = `<h4><i class="fas fa-exclamation-triangle"></i> Breach Found!</h4><p>This email was found in a historical data leak.</p>`;
                showToast("Caution! Potential breaches found.", "error");
            } else {
                env.breachResult.innerHTML = `<h4><i class="fas fa-check-circle"></i> All Clear!</h4><p>No known breaches found for this email.</p>`;
                showToast("No breaches found!", "success");
            }

            env.checkBreachBtn.disabled = false;
            env.checkBreachBtn.innerHTML = '<i class="fas fa-search"></i> Check for Breaches';
        });
    }

    // ===== Quiz Logic =====
    if (env.startQuizBtn) {
        env.startQuizBtn.addEventListener('click', () => {
            env.quizStart.style.display = 'none';
            env.quizQuestionSection.style.display = 'block';
            loadQuestion(0);
        });
    }

    if (env.restartQuizBtn) {
        env.restartQuizBtn.addEventListener('click', () => {
            currentQuestion = 0;
            score = 0;
            userAnswers = [];
            env.quizResult.style.display = 'none';
            env.quizStart.style.display = 'block';
        });
    }

    // ===== Phishing Simulator Logic =====
    function loadScenario(index) {
        const scenario = emailScenarios[index];
        const scenarioEl = {
            from: document.getElementById('emailFrom'),
            subject: document.getElementById('emailSubject'),
            body: document.getElementById('emailBody'),
            result: document.getElementById('simResult'),
            legitBtn: document.getElementById('btnLegit'),
            phishingBtn: document.getElementById('btnPhishing'),
            nextBtn: document.getElementById('btnNextScenario')
        };

        if (scenarioEl.from) scenarioEl.from.textContent = scenario.from;
        if (scenarioEl.subject) scenarioEl.subject.textContent = scenario.subject;
        if (scenarioEl.body) scenarioEl.body.innerHTML = scenario.body;
        if (scenarioEl.result) scenarioEl.result.style.display = 'none';
        if (scenarioEl.legitBtn) scenarioEl.legitBtn.disabled = false;
        if (scenarioEl.phishingBtn) scenarioEl.phishingBtn.disabled = false;
        if (scenarioEl.nextBtn) scenarioEl.nextBtn.style.display = 'none';
    }

    function handleSimResult(isPhishingGuess) {
        const scenario = emailScenarios[currentScenario];
        const resultEl = document.getElementById('simResult');
        const nextBtn = document.getElementById('btnNextScenario');
        const isCorrect = isPhishingGuess === scenario.isPhishing;

        if (resultEl) {
            resultEl.style.display = 'block';
            resultEl.className = `sim-result ${isCorrect ? 'correct' : 'incorrect'} show`;
            resultEl.innerHTML = `<i class="fas fa-${isCorrect ? 'check' : 'times'}-circle"></i> ${isCorrect ? 'Correct!' : 'Incorrect!'} ${scenario.explanation}`;
        }
        
        if (nextBtn) nextBtn.style.display = 'inline-flex';
        showToast(isCorrect ? "Great job!" : "Keep learning!", isCorrect ? "success" : "info");
    }

    const btnLegit = document.getElementById('btnLegit');
    const btnPhishing = document.getElementById('btnPhishing');
    const btnNextScenario = document.getElementById('btnNextScenario');

    if (btnLegit) btnLegit.addEventListener('click', (e) => {
        createRipple(e, btnLegit);
        handleSimResult(false);
    });

    if (btnPhishing) btnPhishing.addEventListener('click', (e) => {
        createRipple(e, btnPhishing);
        handleSimResult(true);
    });

    if (btnNextScenario) btnNextScenario.addEventListener('click', (e) => {
        createRipple(e, btnNextScenario);
        currentScenario = (currentScenario + 1) % emailScenarios.length;
        loadScenario(currentScenario);
    });

    // Initial Scenario Load
    if (document.getElementById('emailFrom')) loadScenario(0);

    // ===== Modals =====
    const openPrivacy = document.getElementById('openPrivacy');
    const openTerms = document.getElementById('openTerms');

    if (openPrivacy) openPrivacy.addEventListener('click', () => env.privacyModal.classList.add('show'));
    if (openTerms) openTerms.addEventListener('click', () => env.termsModal.classList.add('show'));

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(m => m.classList.remove('show'));
        });
    });

    // ===== Contact Form & Database Logic =====
    if (env.contactForm) {
        env.contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = env.contactForm.querySelector('button');
            const formData = new FormData(env.contactForm);
            
            // 1. Save to Local Backup (LocalStorage)
            const msgData = {
                date: new Date().toLocaleString(),
                name: formData.get('name') || "N/A",
                email: formData.get('email') || "N/A",
                message: formData.get('message') || "N/A"
            };
            const msgs = JSON.parse(localStorage.getItem('cs_messages') || '[]');
            msgs.push(msgData);
            localStorage.setItem('cs_messages', JSON.stringify(msgs));

            // 2. Visual Feedback
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;

            // 3. Send to Permanent Database (Formspree)
            try {
                const response = await fetch(env.contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    showToast("Message sent to Cloud and Local Database!", 'success');
                    env.contactForm.reset();
                } else {
                    showToast("Cloud backup failed, but saved locally.", 'warning');
                }
            } catch (error) {
                showToast("Connection error, but saved locally.", 'error');
            } finally {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }
        });
    }

    const viewMessagesBtn = document.getElementById('viewMessagesBtn');
    const messagesModal = document.getElementById('messagesModal');
    const messageTableBody = document.getElementById('messageTableBody');
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    const clearMessagesBtn = document.getElementById('clearMessagesBtn');

    if (viewMessagesBtn) {
        // Secret Activation: Click copyright 5 times to show the button
        const copyright = document.querySelector('.footer-bottom p:first-child');
        let clickCount = 0;
        if (copyright) {
            copyright.addEventListener('click', () => {
                clickCount++;
                if (clickCount === 5) {
                    viewMessagesBtn.style.display = 'inline-flex';
                    showToast("Admin Mode Activated", "success");
                }
            });
        }

        viewMessagesBtn.addEventListener('click', () => {
            const adminEmail = prompt("🔐 Admin Security Check\nPlease enter your email to view sender logs:");
            if (adminEmail === "numanansari920301@gmail.com") {
                renderMessages();
                if (messagesModal) messagesModal.classList.add('show');
                showToast("Access Granted. Welcome back, Numan!", "success");
            } else {
                showToast("Access Denied! Incorrect admin email.", "error");
            }
        });
    }

    function renderMessages() {
        if (!messageTableBody) return;
        const msgs = JSON.parse(localStorage.getItem('cs_messages') || '[]');
        if (msgs.length === 0) {
            messageTableBody.innerHTML = '<tr><td colspan="4" style="padding: 20px; text-align: center; opacity: 0.5;">No messages found in database.</td></tr>';
            return;
        }
        messageTableBody.innerHTML = msgs.map(m => `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 12px; font-size: 0.8rem;">${m.date}</td>
                <td style="padding: 12px;">${m.name}</td>
                <td style="padding: 12px;">${m.email}</td>
                <td style="padding: 12px; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${m.message}</td>
            </tr>
        `).join('');
    }

    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', () => {
            const msgs = JSON.parse(localStorage.getItem('cs_messages') || '[]');
            if (msgs.length === 0) {
                showToast("No data to export!", "error");
                return;
            }

            let csv = "Date,Name,Email,Message\n";
            msgs.forEach(m => {
                csv += `"${m.date}","${m.name.replace(/"/g, '""')}","${m.email.replace(/"/g, '""')}","${m.message.replace(/"/g, '""')}"\n`;
            });

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `CyberShield_Messages_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast("Excel (CSV) file exported successfully!", "success");
        });
    }

    if (clearMessagesBtn) {
        clearMessagesBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to clear all saved messages?")) {
                localStorage.removeItem('cs_messages');
                renderMessages();
                showToast("Database cleared.", "info");
            }
        });
    }

    // ===== Helper Functions (Internal) =====
    function checkPasswordStrength(password) {
        if (!env.strengthBar) return;
        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        const percentage = (score / 5) * 100;
        env.strengthBar.style.width = percentage + '%';
        
        if (score <= 2) env.strengthBar.style.backgroundColor = 'var(--danger)';
        else if (score <= 4) env.strengthBar.style.backgroundColor = 'var(--warning)';
        else env.strengthBar.style.backgroundColor = 'var(--success)';
        
        if (env.strengthLabel) {
            const labels = ['Weak', 'Weak', 'Moderate', 'Moderate', 'Strong', 'Strong'];
            env.strengthLabel.textContent = labels[score];
        }
    }

    function generateCustomPassword(length, upper, lower, numbers, special) {
        let charset = "";
        if (lower) charset += "abcdefghijklmnopqrstuvwxyz";
        if (upper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (numbers) charset += "0123456789";
        if (special) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
        if (!charset) charset = "abcdefghijklmnopqrstuvwxyz";

        let ret = "";
        for(let i=0; i<length; i++) {
            ret += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return ret;
    }

    function loadQuestion(index) {
        const q = quizQuestions[index];
        const questionText = document.getElementById('questionText');
        const answersContainer = document.getElementById('answersContainer');
        const questionNumber = document.getElementById('questionNumber');

        if (!questionText || !answersContainer) return;

        questionNumber.textContent = `Question ${index + 1}/${quizQuestions.length}`;
        questionText.textContent = q.question;
        answersContainer.innerHTML = '';

        q.answers.forEach((ans, i) => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.textContent = ans;
            btn.addEventListener('click', () => handleAnswer(i));
            answersContainer.appendChild(btn);
        });
    }

    function handleAnswer(index) {
        const q = quizQuestions[currentQuestion];
        if (index === q.correct) score++;
        
        currentQuestion++;
        if (currentQuestion < quizQuestions.length) {
            loadQuestion(currentQuestion);
        } else {
            showResults();
        }
    }

    function showResults() {
        env.quizQuestionSection.style.display = 'none';
        env.quizResult.style.display = 'block';
        const scoreEl = document.getElementById('resultScore');
        if (scoreEl) scoreEl.textContent = `${score}/${quizQuestions.length}`;
        if (score === quizQuestions.length) createConfetti();
    }
    
    // Initial State Fixes
    document.querySelectorAll('.threat-example').forEach(ex => {
        ex.style.maxHeight = '0';
        ex.style.overflow = 'hidden';
    });
});