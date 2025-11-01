  // Для демонстрации - в реальном приложении замените на реальный URL
        const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Замените на ваш endpoint
        
        document.addEventListener('DOMContentLoaded', function() {
            const card = document.getElementById('birthdayCard');
            const flipButtons = document.querySelectorAll('.flip-btn');
            const rsvpButton = document.getElementById('rsvpButton');
            const confirmationMessage = document.getElementById('confirmationMessage');
            const guestsList = document.getElementById('guestsList');
            const tabs = document.querySelectorAll('.tab');
            const loading = document.getElementById('loading');
            const guestsLoading = document.getElementById('guestsLoading');
            
            // Анимация переворота открытки
            flipButtons.forEach(button => {
                button.addEventListener('click', function() {
                    card.classList.toggle('flipped');
                });
            });
            
            // Переключение вкладок
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabId = this.getAttribute('data-tab');
                    
                    // Активируем выбранную вкладку
                    tabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Показываем соответствующий контент
                    document.querySelectorAll('.tab-content').forEach(content => {
                        content.classList.remove('active');
                    });
                    document.getElementById(`${tabId}-tab`).classList.add('active');
                    
                    // Если открыли вкладку гостей, загружаем список
                    if (tabId === 'guests') {
                        loadGuests();
                    }
                });
            });
            
            // Обработка подтверждения участия
            rsvpButton.addEventListener('click', function() {
                const userName = document.getElementById('userName').value.trim();
                const userEmail = document.getElementById('userEmail').value.trim();
                const userComment = document.getElementById('userComment').value.trim();
                
                if (userName === '') {
                    showMessage('Пожалуйста, введите ваше имя', 'error');
                    return;
                }
                
                // Показываем загрузку
                loading.style.display = 'block';
                rsvpButton.disabled = true;
                
                // Отправляем данные
                sendRSVP(userName, userEmail, userComment);
            });
            
            // Функция отправки данных
            async function sendRSVP(name, email, comment) {
                const rsvpData = {
                    name: name,
                    email: email,
                    comment: comment,
                    timestamp: new Date().toISOString(),
                    event: 'День рождения 15.12.2023'
                };
                
                try {
                    // В реальном приложении замените на ваш API endpoint
                    const response = await fetch(API_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(rsvpData)
                    });
                    
                    if (response.ok) {
                        // В реальном приложении здесь может быть запись в базу данных
                        // или отправка email организатору
                        
                        // Сохраняем в localStorage для демонстрации
                        saveToLocalStorage(rsvpData);
                        
                        showMessage(`Спасибо, ${name}! Жду тебя на празднике!`, 'success');
                        document.getElementById('guestName').textContent = name;
                        createConfetti();
                        
                        // Очищаем форму
                        document.getElementById('userName').value = '';
                        document.getElementById('userEmail').value = '';
                        document.getElementById('userComment').value = '';
                    } else {
                        throw new Error('Ошибка отправки');
                    }
                } catch (error) {
                    console.error('Ошибка:', error);
                    // Для демонстрации сохраняем в localStorage даже при ошибке сети
                    saveToLocalStorage(rsvpData);
                    showMessage(`Спасибо, ${name}! Твой ответ записан. Жду тебя!`, 'success');
                    document.getElementById('guestName').textContent = name;
                    createConfetti();
                } finally {
                    loading.style.display = 'none';
                    rsvpButton.disabled = false;
                }
            }
            
            // Сохранение в localStorage для демонстрации
            function saveToLocalStorage(rsvpData) {
                let guests = JSON.parse(localStorage.getItem('birthdayGuests')) || [];
                guests.push(rsvpData);
                localStorage.setItem('birthdayGuests', JSON.stringify(guests));
            }
            
            // Загрузка списка гостей
            function loadGuests() {
                guestsLoading.style.display = 'block';
                
                // Имитация загрузки с сервера
                setTimeout(() => {
                    let guests = JSON.parse(localStorage.getItem('birthdayGuests')) || [];
                    
                    if (guests.length === 0) {
                        guestsList.innerHTML = '<p>Пока никто не подтвердил участие. Будь первым!</p>';
                    } else {
                        guestsList.innerHTML = '';
                        guests.forEach(guest => {
                            const guestElement = document.createElement('div');
                            guestElement.className = 'guest-item';
                            guestElement.innerHTML = `
                                <div>
                                    <div class="guest-name">${guest.name}</div>
                                    ${guest.comment ? `<div class="guest-comment">${guest.comment}</div>` : ''}
                                </div>
                            `;
                            guestsList.appendChild(guestElement);
                        });
                    }
                    
                    guestsLoading.style.display = 'none';
                }, 1000);
            }
            
            // Показать сообщение
            function showMessage(text, type) {
                confirmationMessage.textContent = text;
                confirmationMessage.className = 'message ' + type;
                confirmationMessage.style.display = 'block';
                
                // Автоматически скрыть через 5 секунд
                setTimeout(() => {
                    confirmationMessage.style.display = 'none';
                }, 5000);
            }
            
            // Создание конфетти
            function createConfetti() {
                const colors = ['#ff4081', '#536dfe', '#4caf50', '#ffc107', '#9c27b0'];
                for (let i = 0; i < 50; i++) {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = Math.random() * 100 + 'vw';
                    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
                    confetti.style.animationDelay = Math.random() * 2 + 's';
                    document.body.appendChild(confetti);
                    
                    setTimeout(() => {
                        confetti.remove();
                    }, 5000);
                }
            }
        });