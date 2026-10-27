const API_URL = 'https://codealpha-socialmediaapp-zbcn.onrender.com/api';
let isLoginMode = true;

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) showFeed(user);
});

function toggleAuth() {
    isLoginMode = !isLoginMode;
    document.getElementById('auth-title').innerText = isLoginMode ? 'Login to Connect' : 'Create an Account';
    document.getElementById('auth-btn').innerText = isLoginMode ? 'Login' : 'Register';
    document.getElementById('name').style.display = isLoginMode ? 'none' : 'block';
    document.getElementById('toggle-msg').innerText = isLoginMode ? "Don't have an account? Register" : "Already have an account? Login";
}

async function handleAuth() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const endpoint = isLoginMode ? '/auth/login' : '/auth/register';
    const body = isLoginMode ? { email, password } : { name, email, password };

    try {
        const res = await fetch(API_URL + endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();

        if (res.ok) {
            if (isLoginMode) {
                localStorage.setItem('token', data.token);
                if(!data.user.profilePic) data.user.profilePic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                localStorage.setItem('user', JSON.stringify(data.user));
                showFeed(data.user);
            } else {
                alert('Registration successful! Please login.');
                toggleAuth();
            }
        } else { alert(data.msg || 'Something went wrong'); }
    } catch (err) { alert('Server error. Is backend running?'); }
}

function showFeed(user) {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('feed-section').style.display = 'block';
    document.getElementById('user-info').style.display = 'flex';
    document.getElementById('welcome-msg').innerText = `Hi, ${user.name}`;
    document.getElementById('nav-profile-pic').src = user.profilePic;
    fetchPosts();
}

function logout() {
    localStorage.clear();
    location.reload();
}

async function fetchPosts() {
    try {
        const res = await fetch(API_URL + '/posts');
        const posts = await res.json();
        const feed = document.getElementById('posts-feed');
        
        if (posts.length === 0) {
            feed.innerHTML = '<p style="text-align:center; color:gray;">No posts yet. Be the first!</p>';
            return;
        }

        feed.innerHTML = posts.map(post => `
            <div class="post-card">
                <div class="post-header">
                    <div class="avatar">${post.userId.name.charAt(0).toUpperCase()}</div>
                    <span class="author-name">${post.userId.name}</span>
                </div>
                ${post.text ? `<div class="post-content">${post.text}</div>` : ''}
                ${post.imageUrl ? `<img src="${post.imageUrl}" class="post-image" alt="post image">` : ''}
                <div class="post-actions">
                    <button onclick="likePost('${post._id}')">❤️ Like (${post.likes.length})</button>
                    <button onclick="toggleComment('${post._id}')">💬 Comment</button>
                </div>
                <div id="comment-section-${post._id}" class="comment-section">
                    <div class="comment-input-box">
                        <input type="text" id="comment-input-${post._id}" placeholder="Write a comment...">
                        <button onclick="addComment('${post._id}')">Send</button>
                    </div>
                    <div id="comment-list-${post._id}" class="comment-list"></div>
                </div>
            </div>
        `).join('');
    } catch (err) { console.log(err); }
}

async function createPost() {
    const text = document.getElementById('post-text').value;
    const imageUrl = document.getElementById('post-image').value;
    const token = localStorage.getItem('token');
    
    if (!text && !imageUrl) return alert('Please write something or add an image!');

    try {
        const res = await fetch(API_URL + '/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ text, imageUrl })
        });
        if (res.ok) {
            document.getElementById('post-text').value = ''; 
            document.getElementById('post-image').value = ''; 
            fetchPosts(); 
        }
    } catch (err) { alert('Error creating post'); }
}

async function likePost(postId) {
    const token = localStorage.getItem('token');
    try {
        await fetch(`${API_URL}/posts/${postId}/like`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchPosts();
    } catch (err) { console.log(err); }
}

function toggleComment(postId) {
    const section = document.getElementById(`comment-section-${postId}`);
    if (section.style.display === 'none' || section.style.display === '') {
        section.style.display = 'block';
        fetchComments(postId);
    } else {
        section.style.display = 'none';
    }
}

async function fetchComments(postId) {
    try {
        const res = await fetch(`${API_URL}/posts/${postId}/comments`);
        const comments = await res.json();
        const list = document.getElementById(`comment-list-${postId}`);
        if(comments.length === 0) { list.innerHTML = '<p style="font-size:12px; color:gray;">No comments yet.</p>'; return; }
        list.innerHTML = comments.map(c => `<div class="comment-item"><strong>${c.userId.name}:</strong> ${c.text}</div>`).join('');
    } catch(err) { console.log(err); }
}

async function addComment(postId) {
    const text = document.getElementById(`comment-input-${postId}`).value;
    const token = localStorage.getItem('token');
    if (!text) return;
    try {
        await fetch(`${API_URL}/posts/${postId}/comment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ text })
        });
        document.getElementById(`comment-input-${postId}`).value = '';
        fetchComments(postId); 
    } catch (err) { console.log(err); }
}

function showProfile() {
    const user = JSON.parse(localStorage.getItem('user'));
    document.getElementById('modal-profile-pic').src = user.profilePic;
    document.getElementById('modal-name').innerText = user.name;
    document.getElementById('modal-email').innerText = user.email;
    document.getElementById('profile-modal').style.display = 'flex';
}

function closeProfile() {
    document.getElementById('profile-modal').style.display = 'none';
}

async function openCamera() {
    const newPicUrl = prompt("Enter new Profile Picture URL (or leave empty to cancel):");
    if (newPicUrl) {
        const token = localStorage.getItem('token');
        let user = JSON.parse(localStorage.getItem('user'));
        try {
            await fetch(`${API_URL}/users/profilepic`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ profilePic: newPicUrl })
            });
            user.profilePic = newPicUrl;
            localStorage.setItem('user', JSON.stringify(user));
            document.getElementById('nav-profile-pic').src = newPicUrl;
            alert('Profile picture updated successfully!');
        } catch (err) { alert('Error updating profile pic'); }
    }
}