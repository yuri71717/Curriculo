document.addEventListener('DOMContentLoaded', () => {
    // 1. Render Current Year in Footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar-custom');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Typewriter Effect
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
            speed = delayBetweenWords; // Pausa no final da palavra
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            speed = 500; // Pequena pausa antes de começar a digitar a próxima
        }

        setTimeout(type, speed);
    }
    
    // Inicia o typewriter
    setTimeout(type, 500);

    // 4. Animação de Skill Bars com Intersection Observer
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
                    // Para de observar após animar
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        skillObserver.observe(skillsSection);
    }

    // 5. Contact Form Submission (Web3Forms / Simulation)
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

            // Verifica se a chave padrão ainda não foi alterada (modo simulação local)
            if (accessKey === 'YOUR_ACCESS_KEY_HERE' || accessKey.trim() === '') {
                setTimeout(() => {
                    btnSubmit.innerHTML = 'Mensagem Enviada!';
                    btnSubmit.classList.remove('btn-neon');
                    btnSubmit.classList.add('btn-success');
                    
                    showNotification('Simulação: Mensagem recebida! (Troque YOUR_ACCESS_KEY_HERE no index.html por sua chave real do Web3Forms para enviar e-mails de verdade).');
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

            // Envio Real via API Web3Forms (ideal para GitHub Pages estático)
            try {
                // Atualiza o assunto do formulário dinamicamente para o e-mail
                document.getElementById('email_subject_title').value = `Contato Portfólio Yuri: ${subject}`;
                
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
                        subject: `Contato Portfólio Yuri: ${subject}`,
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

    // Função auxiliar para mostrar notificações bonitas na tela
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

        // Animação de entrada
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);

        // Remove após 5 segundos
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => {
                notification.remove();
            }, 400);
        }, 5000);
    }
});
