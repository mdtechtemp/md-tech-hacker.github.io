// API endpoints
const API_URL = 'http://localhost:5000/api';

// Post Management
async function getPosts() {
    try {
        const response = await fetch(`${API_URL}/posts`);
        const posts = await response.json();
        return posts;
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

async function createPost(postData) {
    try {
        const response = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        });
        const newPost = await response.json();
        return newPost;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
}

async function updatePost(postId, postData) {
    try {
        const response = await fetch(`${API_URL}/posts/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        });
        const updatedPost = await response.json();
        return updatedPost;
    } catch (error) {
        console.error('Error updating post:', error);
        throw error;
    }
}

async function deletePost(postId) {
    try {
        await fetch(`${API_URL}/posts/${postId}`, {
            method: 'DELETE'
        });
        return true;
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
}

// Dashboard Functions
async function loadDashboardStats() {
    const posts = await getPosts();
    
    // Update stats
    document.getElementById('totalPosts').textContent = posts.length;
    document.getElementById('totalTools').textContent = posts.filter(p => p.categories.includes('Tools')).length;
    document.getElementById('activeBins').textContent = posts.filter(p => p.categories.includes('BIN') && p.status === 'published').length;
    
    // Update recent posts list
    const recentPostsList = document.getElementById('recentPosts');
    if (recentPostsList) {
        recentPostsList.innerHTML = posts
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(post => `
                <div class="p-6 flex items-center justify-between border-b">
                    <div>
                        <h4 class="font-medium">${post.title}</h4>
                        <p class="text-sm text-gray-600">Published on ${new Date(post.publishDate).toLocaleDateString()}</p>
                    </div>
                    <div class="flex items-center space-x-3">
                        <button onclick="editPost(${post.id})" class="p-2 text-blue-600 hover:text-blue-700">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="confirmDelete(${post.id})" class="p-2 text-red-600 hover:text-red-700">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
    }
}

// New Post Functions
async function submitPost(isDraft = false) {
    try {
        console.log('Submitting post...');
        const postData = {
            title: document.getElementById('postTitle').value,
            content: document.getElementById('postContent').value,
            status: isDraft ? 'draft' : 'published',
            visibility: document.getElementById('visibility').value,
            publishDate: document.getElementById('publishDate').value || new Date().toISOString(),
            categories: Array.from(document.querySelectorAll('input[name="categories"]:checked')).map(cb => cb.value),
            binDetails: {
                binNumber: document.getElementById('binNumber').value,
                status: document.getElementById('binStatus').value,
                security: document.getElementById('security').value,
                type: document.getElementById('binType').value
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        console.log('Post data:', postData);
        const newPost = await createPost(postData);
        console.log('Post created:', newPost);
        showNotification('Post created successfully!', 'success');
        setTimeout(() => window.location.href = 'dashboard.html', 1500);
    } catch (error) {
        console.error('Error in submitPost:', error);
        showNotification('Error creating post: ' + error.message, 'error');
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    } text-white`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function confirmDelete(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
        deletePost(postId)
            .then(() => {
                showNotification('Post deleted successfully!', 'success');
                loadDashboardStats();
            })
            .catch(() => showNotification('Error deleting post', 'error'));
    }
}

function editPost(postId) {
    window.location.href = `new-post.html?id=${postId}`;
}

// Initialize pages
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('dashboard.html')) {
        loadDashboardStats();
    }
    
    if (currentPage.includes('new-post.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        
        if (postId) {
            // Load existing post data for editing
            fetch(`${API_URL}/posts/${postId}`)
                .then(response => response.json())
                .then(post => {
                    document.getElementById('postTitle').value = post.title;
                    document.getElementById('postContent').value = post.content;
                    // ... populate other fields
                });
        }
    }
});
