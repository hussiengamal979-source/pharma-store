/**
 * ============================================================================
 * Chefaa - Full Store Showcase
 * Pure Vanilla JavaScript (Zero External Libraries)
 * Clean, Optimized, and Thoroughly Commented
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', async () => {
  let productData;

  try {
    const response = await fetch('./data/products.json');
    if (!response.ok) {
      throw new Error(`Failed to load products: ${response.status} ${response.statusText}`);
    }
    productData = await response.json();
  } catch (error) {
    console.error('Unable to load product data.', error);
    return;
  }

  Object.entries(productData.products).forEach(([gridId, products]) => {
    const grid = document.getElementById(gridId);
    if (!grid) {
      throw new Error(`Missing product grid: ${gridId}`);
    }

    grid.innerHTML = products.map((product) => `
      <article class="product-card${product.featured ? ' card-featured' : ''}">
        <div class="product-image-container">
          <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy" />
        </div>
        <div class="product-details">
          <h3 class="product-title">${product.name}</h3>
          <div class="product-price">
            <span>${product.price}</span>
            <span style="padding-inline-start:8px;">${productData.currency}</span>
          </div>
          <button type="button" class="btn-add-to-cart" data-product="${product.cartName}">اضف الى العربة</button>
        </div>
      </article>
    `).join('');
  });

  // --------------------------------------------------------------------------
  // 1. Element Selectors
  // --------------------------------------------------------------------------
  const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
  const cartBadgeCount = document.getElementById('cartBadgeCount');
  const btnScrollTop = document.getElementById('btnScrollTop');
  const btnWhatsApp = document.getElementById('btnWhatsApp');
  const toastNotification = document.getElementById('toastNotification');

  // Top banner dismiss & coupon
  const closePromoBtn = document.getElementById('closePromoBtn');
  const topPromoBanner = document.getElementById('topPromoBanner');
  const couponBtn = document.getElementById('couponBtn');

  // Search input
  const brandSearchInput = document.getElementById('brandSearchInput');

  let cartCount = 0;

  // --------------------------------------------------------------------------
  // 2. Helper: Display Toast Notification
  // --------------------------------------------------------------------------
  /**
   * Displays an interactive feedback popup at the bottom center of the page.
   * @param {string} message - Feedback text to display.
   */
  function showToast(message) {
    if (!toastNotification) return;

    toastNotification.textContent = message;
    toastNotification.classList.add('show');

    // Automatically remove toast after 2.6 seconds
    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 2600);
  }

  // --------------------------------------------------------------------------
  // 3. Top Banner & Coupon Handlers
  // --------------------------------------------------------------------------
  if (closePromoBtn && topPromoBanner) {
    closePromoBtn.addEventListener('click', () => {
      topPromoBanner.style.display = 'none';
    });
  }

  if (couponBtn) {
    couponBtn.addEventListener('click', () => {
      const code = 'CHJ10';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => {
          showToast(`تم نسخ الكوبون ${code} بنجاح! خصم 10%`);
        }).catch(() => {
          showToast(`كوبون الخصم: ${code}`);
        });
      } else {
        showToast(`كوبون الخصم: ${code}`);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. Unified Add to Cart Handlers (Reusable across all sections)
  // --------------------------------------------------------------------------
  addToCartButtons.forEach((button) => {
    button.addEventListener('click', () => {
      cartCount++;
      if (cartBadgeCount) {
        cartBadgeCount.textContent = cartCount;
        cartBadgeCount.style.transform = 'scale(1.2)';
        setTimeout(() => {
          cartBadgeCount.style.transform = 'scale(1)';
        }, 200);
      }

      const productName = button.getAttribute('data-product') || 'المنتج';

      // Visual feedback state
      button.textContent = 'تمت الإضافة ✓';
      button.classList.add('added');

      // Toast feedback
      showToast(`تمت إضافة ${productName} إلى سلة المشتريات (الإجمالي: ${cartCount})`);

      // Reset button state after 1.5 seconds
      setTimeout(() => {
        button.textContent = 'اضف الى العربة';
        button.classList.remove('added');
      }, 1500);
    });
  });

  // --------------------------------------------------------------------------
  // 5. Reusable Carousel Setup
  // --------------------------------------------------------------------------
  function setupCarousel(prevId, nextId, gridId) {
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    const grid = document.getElementById(gridId);

    if (!prevBtn || !nextBtn || !grid) return;

    prevBtn.addEventListener('click', () => {
      // In RTL, prev button scrolls toward the right
      grid.scrollBy({ left: 300, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      // In RTL, next button scrolls toward the left
      grid.scrollBy({ left: -300, behavior: 'smooth' });
    });
  }

  setupCarousel('skincarePrevBtn', 'skincareNextBtn', 'skincare-grid');
  setupCarousel('grapexonPrevBtn', 'grapexonNextBtn', 'grapexon-grid');
  setupCarousel('forHerPrevBtn', 'forHerNextBtn', 'for-her-grid');
  setupCarousel('haircarePrevBtn', 'haircareNextBtn', 'haircare-grid');
  setupCarousel('babyPrevBtn', 'babyNextBtn', 'baby-grid');

  // --------------------------------------------------------------------------
  // 6. Scroll To Top Action
  // --------------------------------------------------------------------------
  if (btnScrollTop) {
    btnScrollTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  // --------------------------------------------------------------------------
  // 7. WhatsApp Customer Support Widget
  // --------------------------------------------------------------------------
  if (btnWhatsApp) {
    btnWhatsApp.addEventListener('click', () => {
      showToast('جاري فتح محادثة صيدلي شفاء عبر واتساب للاستشارة المجانية...');
    });
  }

  // --------------------------------------------------------------------------
  // 8. Search Input Feedback
  // --------------------------------------------------------------------------
  if (brandSearchInput) {
    brandSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = brandSearchInput.value.trim();
        if (query) {
          showToast(`جاري البحث عن منتجات ماركة: ${query}`);
        }
      }
    });
  }
});
