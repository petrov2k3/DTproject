function checkAnswers() {
    // Правильні відповіді
    const correctAnswers = {
        q1: 'a2', // Правильна відповідь для тесту 1
        q9: ['рівнянням прямокутного клина', 'прямокутним клином'], // Множинні правильні відповіді
        q10: ['платіжною множиною D' , 'Платіжною множиною D', 'платіжною множиною'],
        step1: 'C', // правильні відповіді для тесту 12
        step2: 'A',
        step3: 'D',
        step4: 'B',
        step5: 'E'
    };

    let score = 0; // Лічильник балів

    // Перевірка тесту 1 (одиночний вибір)
    const q1Answer = document.querySelector('input[name="q1"]:checked');
    if (q1Answer && q1Answer.value === correctAnswers.q1) {
        score++;
    }

    // Перевірка тесту 9 (відкрите питання)
    const q9Answer = document.getElementById('q9').value.trim().toLowerCase();
    if (correctAnswers.q9.some(answer => q9Answer === answer.toLowerCase())) {
        score++;
    }

    // Перевірка тесту 10 (відкрите питання)
    const q10Answer = document.getElementById('q10').value.trim().toLowerCase();
    if (correctAnswers.q10.some(answer => q10Answer === answer.toLowerCase())) {
        score++;
    }

    // Перевірка тесту 12 (послідовність)
    const step1 = document.getElementById('step1').value;
    const step2 = document.getElementById('step2').value;
    const step3 = document.getElementById('step3').value;
    const step4 = document.getElementById('step4').value;
    const step5 = document.getElementById('step5').value;

    if (
        step1 === correctAnswers.step1 &&
        step2 === correctAnswers.step2 &&
        step3 === correctAnswers.step3 &&
        step4 === correctAnswers.step4 &&
        step5 === correctAnswers.step5
    ) {
        score++;
    }

    // Виведення результату
    const result = document.getElementById('result');
    result.textContent = `Ваш результат: ${score}/4 правильних відповідей`;
    result.style.color = score === 4 ? 'green' : 'red';
}
