/**
 * Bartender V2.0 - Instant Search & Filtering
 * Client-side JavaScript for dynamic cocktail filtering
 */

// Global state
let cocktails = [];          // Raw data from API
let filteredCocktails = [];  // Filtered results
let filters = {
    search: '',
    baseSpirits: [],
    difficulties: []
};

// DOM Elements
let searchInput, baseSpiritSelect, difficultySelect, cocktailGrid, loadingIndicator, noResultsMessage, resultCount;

/**
 * Initialize the application
 */
function init() {
    // Get DOM elements
    searchInput = document.getElementById('searchInput');
    baseSpiritSelect = document.getElementById('base-spirit-filter');
    difficultySelect = document.getElementById('difficulty-filter');
    cocktailGrid = document.getElementById('cocktailGrid');
    loadingIndicator = document.getElementById('loading-indicator');
    noResultsMessage = document.getElementById('no-results-message');
    resultCount = document.getElementById('result-count');

    // If required elements are missing, create them
    ensureUIElements();

    // Fetch cocktail data
    fetchCocktails();

    // Setup event listeners
    setupEventListeners();
}

/**
 * Ensure necessary UI elements exist (for fallback)
 */
function ensureUIElements() {
    // If no loading indicator exists, create one
    if (!loadingIndicator) {
        const loader = document.createElement('div');
        loader.id = 'loading-indicator';
        loader.className = 'loading';
        loader.innerHTML = '<div class="spinner"></div><p>Loading cocktails...</p>';
        cocktailGrid.parentNode.insertBefore(loader, cocktailGrid);
        loadingIndicator = loader;
    }

    // If no results message exists, create one
    if (!noResultsMessage) {
        const noResults = document.createElement('div');
        noResults.id = 'no-results-message';
        noResults.className = 'no-results';
        noResults.innerHTML = '<h3>No cocktails found</h3><p>Try adjusting your search or filters</p>';
        noResults.style.display = 'none';
        cocktailGrid.parentNode.insertBefore(noResults, cocktailGrid.nextSibling);
        noResultsMessage = noResults;
    }

    // If result count element doesn't exist, create it
    if (!resultCount) {
        const count = document.createElement('div');
        count.id = 'result-count';
        count.className = 'result-count';
        count.innerHTML = '<span class="count">0</span> cocktails';
        // Insert after search bar or somewhere appropriate
        const searchSection = document.querySelector('.search-section');
        if (searchSection) {
            searchSection.appendChild(count);
        }
        resultCount = count;
    }
}

/**
 * Fetch cocktail data from API
 */
async function fetchCocktails() {
    showLoading(true);
    try {
        const response = await fetch('/api/cocktails');
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        cocktails = await response.json();
        filteredCocktails = [...cocktails];
        
        // Populate filter dropdowns with unique values
        populateFilters();
        
        // Render initial cards
        renderCocktails(filteredCocktails);
        
        // Update result count
        updateResultCount();
    } catch (error) {
        console.error('Failed to fetch cocktails:', error);
        showError('Unable to load cocktail data. Please try again later.');
    } finally {
        showLoading(false);
    }
}

/**
 * Populate dropdowns with unique base spirits and difficulties
 */
function populateFilters() {
    const baseSpirits = [...new Set(cocktails.map(c => c.base_spirit))].filter(Boolean);
    const difficulties = [...new Set(cocktails.map(c => c.difficulty))].filter(Boolean);

    // Clear existing options (except default)
    if (baseSpiritSelect) {
        baseSpiritSelect.innerHTML = '<option value="">All Base Spirits</option>';
        baseSpirits.forEach(spirit => {
            const option = document.createElement('option');
            option.value = spirit;
            option.textContent = spirit;
            baseSpiritSelect.appendChild(option);
        });
    }

    if (difficultySelect) {
        difficultySelect.innerHTML = '<option value="">All Difficulties</option>';
        difficulties.forEach(diff => {
            const option = document.createElement('option');
            option.value = diff;
            option.textContent = diff;
            difficultySelect.appendChild(option);
        });
    }
}

/**
 * Render cocktail cards to the grid
 * @param {Array} cocktails - Array of cocktail objects
 */
function renderCocktails(cocktails) {
    // Clear existing cards
    cocktailGrid.innerHTML = '';

    if (cocktails.length === 0) {
        showNoResults(true);
        return;
    }

    showNoResults(false);

    // Create card for each cocktail
    cocktails.forEach(cocktail => {
        const card = createCocktailCard(cocktail);
        cocktailGrid.appendChild(card);
    });
}

/**
 * Create a single cocktail card element
 * @param {Object} cocktail - Cocktail data object
 * @returns {HTMLElement} Card element
 */
function createCocktailCard(cocktail) {
    const card = document.createElement('div');
    card.className = 'cocktail-card';
    card.dataset.baseSpirit = cocktail.base_spirit;
    card.dataset.difficulty = cocktail.difficulty;
    card.dataset.tags = cocktail.tags.join(' ');

    // Generate placeholder image URL with cocktail name
    const imageUrl = `https://via.placeholder.com/400x300/6d8cbf/ffffff?text=${encodeURIComponent(cocktail.name)}`;

    // Difficulty badge class mapping
    const difficultyClass = {
        'Easy': 'badge-easy',
        'Medium': 'badge-medium',
        'Complex': 'badge-complex'
    }[cocktail.difficulty] || 'badge-default';

    // Build card HTML
    card.innerHTML = `
        <div class="card-image">
            <img src="${imageUrl}" alt="${cocktail.name}" loading="lazy">
        </div>
        <div class="card-content">
            <h3 class="card-title">${cocktail.name}</h3>
            <div class="card-meta">
                <span class="difficulty-badge ${difficultyClass}">${cocktail.difficulty}</span>
                <span class="base-spirit">${cocktail.base_spirit}</span>
            </div>
            <p class="card-description">${cocktail.category} • ${cocktail.prep_time}</p>
            <div class="card-tags">
                ${cocktail.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <a href="/recipe/${cocktail.id}" class="card-link">View Recipe <i class="fas fa-arrow-right"></i></a>
        </div>
    `;

    return card;
}

/**
 * Apply filters based on current filter state
 */
function applyFilters() {
    filteredCocktails = cocktails.filter(cocktail => {
        // Search filter
        if (filters.search && !cocktail.name.toLowerCase().includes(filters.search.toLowerCase())) {
            return false;
        }

        // Base spirit filter
        if (filters.baseSpirits.length > 0 && !filters.baseSpirits.includes(cocktail.base_spirit)) {
            return false;
        }

        // Difficulty filter
        if (filters.difficulties.length > 0 && !filters.difficulties.includes(cocktail.difficulty)) {
            return false;
        }

        return true;
    });

    renderCocktails(filteredCocktails);
    updateResultCount();
}

/**
 * Update filter state from UI
 */
function updateFilters() {
    // Search term
    filters.search = searchInput.value.trim();

    // Base spirits (multiple selection)
    filters.baseSpirits = Array.from(baseSpiritSelect.selectedOptions).map(opt => opt.value).filter(v => v);

    // Difficulties (multiple selection)
    filters.difficulties = Array.from(difficultySelect.selectedOptions).map(opt => opt.value).filter(v => v);

    applyFilters();
}

/**
 * Debounce function to limit rapid calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Set up event listeners for search and filters
 */
function setupEventListeners() {
    // Prevent form submission
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => e.preventDefault());
    }

    // Debounced search input
    const debouncedFilter = debounce(updateFilters, 300);
    searchInput.addEventListener('input', debouncedFilter);

    // Dropdown changes
    if (baseSpiritSelect) {
        baseSpiritSelect.addEventListener('change', updateFilters);
    }
    if (difficultySelect) {
        difficultySelect.addEventListener('change', updateFilters);
    }

    // Reset filters button (optional)
    const resetButton = document.getElementById('reset-filters');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            searchInput.value = '';
            if (baseSpiritSelect) baseSpiritSelect.value = '';
            if (difficultySelect) difficultySelect.value = '';
            updateFilters();
        });
    }
}

/**
 * Show/hide loading indicator
 * @param {boolean} show - Whether to show loading indicator
 */
function showLoading(show) {
    if (loadingIndicator) {
        loadingIndicator.style.display = show ? 'block' : 'none';
    }
    if (show) {
        cocktailGrid.style.opacity = '0.5';
    } else {
        cocktailGrid.style.opacity = '1';
    }
}

/**
 * Show/hide no results message
 * @param {boolean} show - Whether to show no results
 */
function showNoResults(show) {
    if (noResultsMessage) {
        noResultsMessage.style.display = show ? 'block' : 'none';
    }
}

/**
 * Update result count display
 */
function updateResultCount() {
    if (resultCount) {
        const count = filteredCocktails.length;
        const total = cocktails.length;
        resultCount.innerHTML = `<span class="count">${count}</span> of ${total} cocktails`;
    }
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<strong>Error:</strong> ${message}`;
    errorDiv.style.cssText = 'background: #f8d7da; color: #721c24; padding: 1rem; border-radius: 4px; margin: 1rem 0;';
    
    // Insert after search section
    const searchSection = document.querySelector('.search-section');
    if (searchSection) {
        searchSection.parentNode.insertBefore(errorDiv, searchSection.nextSibling);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}