class AuthService {
    static BASE_URL = '/floreriaholanda/api/auth';
    
    static async login(email, password) {
        const response = await fetch(`${this.BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        return await response.json();
    }
    
    static async register(nombre, email, password) {
        const response = await fetch(`${this.BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, email, password })
        });
        return await response.json();
    }
    
    static async logout() {
        const response = await fetch(`${this.BASE_URL}/logout`, {
            method: 'POST'
        });
        return await response.json();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterLink = document.getElementById('showRegister');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            const response = await AuthService.login(email, password);
            if (response.status === 'success') {
                alert('Login exitoso');
                location.reload();
            } else {
                alert(response.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al iniciar sesión');
        }
    });
    
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const nombre = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        
        try {
            const response = await AuthService.register(nombre, email, password);
            if (response.status === 'success') {
                alert('Registro exitoso');
                $('#registerModal').modal('hide');
                $('#loginModal').modal('show');
            } else {
                alert(response.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al registrar');
        }
    });
    
    showRegisterLink.addEventListener('click', function(e) {
        e.preventDefault();
        $('#loginModal').modal('hide');
        $('#registerModal').modal('show');
    });
}); 