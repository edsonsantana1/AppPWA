// Função para buscar endereço pelo CEP
function buscarEndereco(cep) {
    return fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json());
}

// Event listener para o campo de CEP
document.getElementById('cep').addEventListener('input', function() {
    const cep = this.value;
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('rua').value = data.logradouro;
                document.getElementById('cidade').value = data.localidade;
                document.getElementById('estado').value = data.uf;
                document.getElementById('bairro').value = data.bairro;
            })
            .catch(error => console.error('Erro ao buscar CEP:', error));
    }
});

// Gravação de áudio
let mediaRecorder;
let audioChunks = [];

document.getElementById('startRecording').addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        mediaRecorder.addEventListener('dataavailable', event => {
            audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener('stop', () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = document.getElementById('audioPlayback');
            audio.src = audioUrl;
            audioChunks = [];
        });

        document.getElementById('startRecording').disabled = true;
        document.getElementById('stopRecording').disabled = false;
    } catch (error) {
        console.error('Erro ao iniciar gravação:', error);
    }
});

document.getElementById('stopRecording').addEventListener('click', () => {
    if (mediaRecorder) {
        mediaRecorder.stop();
        document.getElementById('startRecording').disabled = false;
        document.getElementById('stopRecording').disabled = true;
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const denunciaForm = document.getElementById('denunciaForm');

    denunciaForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Simulação de envio de dados
        const formData = new FormData(denunciaForm);
        console.log('Dados enviados:', Object.fromEntries(formData));

        // Redirecionamento após envio
        window.location.href = 'login.html';
    });

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            const usuario = verificarLogin(email, senha);

            if (usuario) {
                alert('Login realizado com sucesso!');
                localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
                window.location.href = 'perfil.html';
            } else {
                alert('Email ou senha incorretos.');
                window.location.href = 'cadastro.html';
            }
        });
    }
});

function verificarLogin(email, senha) {
    const cadastros = JSON.parse(localStorage.getItem('cadastros')) || [];
    return cadastros.find(cadastro => cadastro.email === email && cadastro.senha === senha);
}