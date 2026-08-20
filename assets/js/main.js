document.addEventListener('DOMContentLoaded', () => {
    // Footer Year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Visitor Counter
    const visitsSpan = document.getElementById('visits');
    if (visitsSpan) {
        fetch('https://api.counterapi.dev/v1/yuri71717/portfolio/up')
            .then(res => res.json())
            .then(data => {
                if (data && data.value) {
                    visitsSpan.textContent = data.value;
                } else {
                    visitsSpan.textContent = '1';
                }
            })
            .catch(err => {
                console.warn('Contador indisponível:', err);
                visitsSpan.textContent = '---';
            });
    }

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar-custom');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Typewriter Effect
    const words = [
        "Desenvolvedor Front-End",
        "Estudante de Sistemas",
        "Desenvolvedor C# / .NET",
        "Apaixonado por Tecnologia"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeTarget = document.getElementById('typewriter');
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const delayBetweenWords = 2000;

    function type() {
        if (!typeTarget) return;
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typeTarget.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typeTarget.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? deletingSpeed : typingSpeed;

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            speed = delayBetweenWords;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }
    
    setTimeout(type, 500);

    // Skills Animation Observer
    const skillsSection = document.getElementById('habilidades');
    const progressFills = document.querySelectorAll('.skill-progress-bar-fill');

    if (skillsSection && progressFills.length > 0) {
        const observerOptions = {
            root: null,
            threshold: 0.15
        };

        const skillObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    progressFills.forEach(fill => {
                        const targetWidth = fill.getAttribute('data-progress');
                        fill.style.width = targetWidth + '%';
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        skillObserver.observe(skillsSection);
    }

    // Contact Form Handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btnSubmit = contactForm.querySelector('button[type="submit"]');
            const originalText = btnSubmit.innerHTML;
            
            const accessKeyInput = document.getElementById('web3forms_key');
            const accessKey = accessKeyInput ? accessKeyInput.value : '';
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            btnSubmit.disabled = true;
            btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Enviando...';

            if (accessKey === 'YOUR_ACCESS_KEY_HERE' || accessKey.trim() === '') {
                setTimeout(() => {
                    btnSubmit.innerHTML = 'Mensagem Enviada!';
                    btnSubmit.classList.remove('btn-neon');
                    btnSubmit.classList.add('btn-success');
                    
                    showNotification('Simulação: Mensagem recebida! Insira sua chave do Web3Forms no HTML para enviar de verdade.');
                    contactForm.reset();
                    
                    setTimeout(() => {
                        btnSubmit.disabled = false;
                        btnSubmit.innerHTML = originalText;
                        btnSubmit.classList.remove('btn-success');
                        btnSubmit.classList.add('btn-neon');
                    }, 3000);
                }, 1500);
                return;
            }

            try {
                document.getElementById('email_subject_title').value = `Contato Portfólio: ${subject}`;
                
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        access_key: accessKey,
                        name: name,
                        email: email,
                        subject: `Contato Portfólio: ${subject}`,
                        message: message
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    btnSubmit.innerHTML = 'Mensagem Enviada!';
                    btnSubmit.classList.remove('btn-neon');
                    btnSubmit.classList.add('btn-success');
                    contactForm.reset();
                    showNotification('Sua mensagem foi enviada com sucesso! Logo entrarei em contato.');
                } else {
                    throw new Error(result.message || 'Erro ao enviar.');
                }
            } catch (error) {
                console.error(error);
                showNotification('Erro ao enviar mensagem: ' + error.message);
                btnSubmit.innerHTML = 'Erro no Envio';
                btnSubmit.classList.remove('btn-neon');
                btnSubmit.classList.add('btn-danger');
            } finally {
                setTimeout(() => {
                    btnSubmit.disabled = false;
                    btnSubmit.innerHTML = originalText;
                    btnSubmit.classList.remove('btn-success', 'btn-danger');
                    btnSubmit.classList.add('btn-neon');
                }, 3000);
            }
        });
    }

    // Toast Notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.background = 'rgba(18, 22, 32, 0.95)';
        notification.style.color = '#00f2fe';
        notification.style.border = '1px solid #00f2fe';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = '12px';
        notification.style.boxShadow = '0 10px 30px rgba(0, 242, 254, 0.2)';
        notification.style.zIndex = '9999';
        notification.style.fontFamily = "'Plus Jakarta Sans', sans-serif";
        notification.style.fontSize = '0.95rem';
        notification.style.fontWeight = '600';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        notification.style.transform = 'translateY(20px)';
        notification.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i> ${message}`;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => {
                notification.remove();
            }, 400);
        }, 5000);
    }
});
