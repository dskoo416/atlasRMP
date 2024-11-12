document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('difficulty-toggle');
    const toast = document.getElementById('toast');


    toggle.addEventListener('click', () => {
        toast.classList.add('show');
        

        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    });
});
