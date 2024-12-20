function checkAnswers() {
    // Правильні відповіді
    const correctAnswers = {
        q1: 'a2', // Правильна відповідь для тесту 1
        q2: 'a2', // Правильна відповідь для тесту 2
        q9: ['рівнянням прямокутного клина', 'прямокутним клином'], // Множинні правильні відповіді
        q10: ['платіжною множиною D' , 'Платіжною множиною D', 'платіжною множиною'],
        step: ['C', 'A', 'D', 'B', 'E'] // Правильні відповіді для питання на відповідність
    };

    let score = { value: 0 }; // Лічильник балів

    // Перевірка тестів з одиночним вибором
    const singleChoiceQuestions = ['q1', 'q2'];
    singleChoiceQuestions.forEach(question => {
        const selectedAnswer = document.querySelector(`input[name="${question}"]:checked`);
        const correctAnswerId = `${question}${correctAnswers[question]}`; // ID правильного варіанту

        // Якщо відповідь вибрана
        if (selectedAnswer) {
            if (selectedAnswer.value === correctAnswers[question]) {
                // Правильна відповідь
                score.value++;
                selectedAnswer.nextElementSibling.classList.add('correct');
            } else {
                // Неправильна відповідь
                selectedAnswer.nextElementSibling.classList.add('incorrect');
                // Підсвічуємо правильну відповідь
                const correctLabel = document.querySelector(`label[for="${correctAnswerId}"]`);
                if (correctLabel) {
                    correctLabel.classList.add('correct');
                }
            }
        } else {
            // Якщо користувач не вибрав відповідь, підсвічуємо правильну
            const correctLabel = document.querySelector(`label[for="${correctAnswerId}"]`);
            if (correctLabel) {
                correctLabel.classList.add('correct');
            }
        }
    });

    // Перевірка тесту 9 (відкрите питання)
    const q9Answer = document.getElementById('q9').value.trim().toLowerCase();
    const q9Feedback = document.getElementById('q9-feedback');
    if (correctAnswers.q9.some(answer => q9Answer === answer.toLowerCase())) {
        score.value++;
        q9Feedback.textContent = 'Правильно!';
        q9Feedback.classList.add('correct');
    } else {
        q9Feedback.textContent = `Неправильно! Правильна відповідь: ${correctAnswers.q9[0]}`;
        q9Feedback.classList.add('incorrect');
    }

    // Перевірка тесту 10 (відкрите питання)
    const q10Answer = document.getElementById('q10').value.trim().toLowerCase();
    const q10Feedback = document.getElementById('q10-feedback');
    if (correctAnswers.q10.some(answer => q10Answer === answer.toLowerCase())) {
        score.value++;
        q10Feedback.textContent = 'Правильно!';
        q10Feedback.classList.add('correct');
    } else {
        q10Feedback.textContent = `Неправильно! Правильна відповідь: ${correctAnswers.q10[0]}`;
        q10Feedback.classList.add('incorrect');
    }

    // Перевірка відповідності (питання 12)
    checkMatchingAnswers('step', correctAnswers.step, score);

    // Виведення результату
    const result = document.getElementById('result');
    result.textContent = `Ваш результат: ${score.value}/9 правильних відповідей`;
    //result.style.color = score.value === 4 ? 'green' : 'red';
    //result.style.color = 'black';
}

// Функція для перевірки питань з одиночним вибором
function checkSingleChoice(questionId, correctAnswer) {
    const selectedAnswer = document.querySelector(`input[name="${questionId}"]:checked`);
    return selectedAnswer && selectedAnswer.value === correctAnswer;
}

function checkMatchingAnswers(questionId, correctAnswers, score) {
    correctAnswers.forEach((correctAnswer, index) => {
        const userAnswer = document.getElementById(`${questionId}${index + 1}`).value;
        const feedback = document.getElementById(`${questionId}${index + 1}-feedback`);
        if (userAnswer === correctAnswer) {
            score.value++; // Оновлюємо лічильник правильних відповідей
            feedback.textContent = 'Правильно!';
            feedback.classList.add('correct');
            feedback.classList.remove('incorrect');
        } else {
            feedback.textContent = `Неправильно! Правильна відповідь: ${correctAnswer}`;
            feedback.classList.add('incorrect');
            feedback.classList.remove('correct');
        }
    });
}