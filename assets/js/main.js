function startCountdownFromTenMinutes() {
  const timers = document.querySelectorAll('.timer');
  
  timers.forEach(timer => {
    const minsElement = timer.querySelector('.mins');
    const secsElement = timer.querySelector('.secs');
    
    let minutes = 10;
    let seconds = 0;
    
    minsElement.textContent = minutes.toString().padStart(2, '0');
    secsElement.textContent = seconds.toString().padStart(2, '0');
    
    const countdown = setInterval(() => {
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(countdown);
          return;
        }
        minutes--;
        seconds = 59;
      } else {
        seconds--;
      }
      
      minsElement.textContent = minutes.toString().padStart(2, '0');
      secsElement.textContent = seconds.toString().padStart(2, '0');
    }, 1000);
  });
}

// Blue or white version

const productMap = {
  "product1": { priceId: 'price_1RWOueQa9ru2DPNT1dDXjj8n', amount: 699 },
  "product2": { priceId: 'price_1RWOw7Qa9ru2DPNTWBir3iI4', amount: 1999 },
  "product3": { priceId: 'price_1RWOw7Qa9ru2DPNTfJkFOi7G', amount: 2999 }
};

let selectedProduct = productMap["product1"];
console.log('Selected:', selectedProduct);

document.addEventListener('DOMContentLoaded', function() {

  mountStripe();
  setupApplePay();

  let style = 'blue';
  document.body.classList.add(style);
  let blueButtons = document.querySelectorAll('.blue-btn'),
  section2 = document.querySelector('.section-2');
  section1 = document.querySelector('.section-1');
  
  blueButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      section2.classList.remove('hidden-section');
      section1.remove();
      requestAnimationFrame(animateProgress);
    })
  })
  
  storageContainer = document.querySelector('.storage-container'),
  completedContainer = document.querySelector('.completed-container');

  let startTime = null;
  const duration = 5000;
  
  function animateProgress(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1); 

    const snowman = document.getElementById("snowman");

    // устанавливает прогресс анимации от 0 до 1
    function setProgress(progress) {
      const totalDuration = 2;
      snowman.setCurrentTime(progress * totalDuration);
    }

    setProgress(progress);
    
    if (progress < 1) {
      // console.log(progress);
      requestAnimationFrame(animateProgress);
    } else {
      console.log('finish');
      setTimeout(() => {
        storageContainer.classList.add('hidden-section');
        completedContainer.classList.remove('hidden-section');
      }, 1000);
    }
  };
  
  let completedButton = document.querySelector('.completed-button'),
  section3 = document.querySelector('.section-3');
  
  if (completedButton != null) {
    completedButton.addEventListener('click', function() {
      completedContainer.classList.add('hidden-section');
      section2.classList.add('hidden-section');
      section3.classList.remove('hidden-section');
    })
  }
  
  // Validation email
  let email = document.getElementById('email'),
  emailBtn = document.querySelector('#emailBtn'),
  error = document.querySelector('.error');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  
  email.addEventListener('input', function() {
    if (email.value.match(emailRegex)) {
      error.classList.remove('active');
      email.classList.remove('error-input');
      emailBtn.classList.remove('blocked');
    } else {
      error.classList.add('active');
      email.classList.add('error-input');
      emailBtn.classList.add('blocked');
    }
  })
    
  // Add email provider to email
  let tooltips = document.querySelectorAll('.tooltips .item');
  
  tooltips.forEach(function(tooltip) {
    tooltip.addEventListener('click', function() {
      email.value = email.value + tooltip.textContent;
      if (email.value.match(emailRegex)) {
        error.classList.remove('active');
        email.classList.remove('error-input');
        emailBtn.classList.remove('blocked');
        
      } else {
        error.classList.add('active');
        email.classList.add('error-input');
        emailBtn.classList.add('blocked');
      }
    })
  });
  
  let nextBtn = document.querySelector('#emailBtn'),
  emailSection = document.querySelector('.section-3 .container'),
  checkoutSection = document.querySelector('.checkout');
  secureSection = document.querySelector('.section-3 .secure-section');

  nextBtn.addEventListener('click', function() {
    if(email.value.match(emailRegex)) {
      secureSection.classList.add('hidden-section');
      emailSection.classList.add('hidden-section');
      checkoutSection.classList.remove('hidden-section');
      section3.classList.remove('block-scroll');
      startCountdownFromTenMinutes();
    }
  })
  
  
  // Package selection
  let packages = document.querySelectorAll('.packages .item');
  
  // packages.forEach(function(package) {
  //   package.addEventListener('click', function() {
  //     packages.forEach(function(package) {
  //       package.classList.remove('active');
  //     })
  //     package.classList.add('active');
  //   })
  // })
  

  packages.forEach(function(item) {
    item.addEventListener('click', function() {
      packages.forEach(p => p.classList.remove('active'));
      item.classList.add('active');

      const id = item.dataset.id;
      console.log('Clicked item with data-id:', id);

      if (!id || !(id in productMap)) {
        console.error('⚠️ Invalid or missing data-id:', id);
        return;
      }
      updateSelectedProduct(productMap[id]);
      console.log('Selected:', selectedProduct);
    });
  });

  // Card validation and formatting
  let cardInputs = document.querySelectorAll('.card-form input');
  let cardErrror = document.querySelectorAll('.card-error');

  cardErrror.forEach(input => {
    input.style.display = 'none'
  });

  let continueBtn = document.querySelector('.continue-btn');
  
  // Format card number with spaces
  function formatCardNumber(input) {
    let value = input.value.replace(/\s/g, ''); // Remove existing spaces
    let formattedValue = '';
    
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' ';
      }
      formattedValue += value[i];
    }
    
    // Limit to 16 digits + spaces
    input.value = formattedValue.slice(0, 19);
  }
  
  // Format expiry date with slash
  function formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, ''); // Remove non-digits
    
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    
    // Limit to MM/YY format
    input.value = value.slice(0, 5);
  }
  
  // Format CVV
  function formatCVV(input) {
    let value = input.value.replace(/\D/g, ''); // Remove non-digits
    input.value = value.slice(0, 4); // Limit to 4 digits
  }
  
  // Add input listeners for formatting
  cardInputs.forEach(input => {
    input.addEventListener('input', function() {
      this.style.border = '';

      const inputField = this.closest('.input-field');
      const errorElement = inputField?.querySelector('.card-error');
  
      if (errorElement) {
        errorElement.style.display = 'none'; 
      }
  
      if (this.placeholder === 'Card number') {
        let value = this.value.replace(/\D/g, ''); // Remove non-digits
        formatCardNumber(this);
      } else if (this.placeholder === 'Expiry date') {
        formatExpiryDate(this);
      } else if (this.placeholder === 'CVV') {
        formatCVV(this);
      }
    });
    
    // Prevent non-digit input only for card number, expiry date and CVV
    input.addEventListener('keypress', function(e) {
      if (this.placeholder === 'Card number' || this.placeholder === 'Expiry date' || this.placeholder === 'CVV') {  
        if (!/^\d$/.test(e.key)) {
          e.preventDefault();
        }
      }
    });
  });

  const cardholderInput = document.getElementById('cardholder-name');
  const errorDiv = cardholderInput.closest('.input-field')?.querySelector('.card-error');
  const inputGroup = cardholderInput.closest('.input-group');
  
  cardholderInput.addEventListener('input', () => {
  if (cardholderInput.value.trim()) {
    inputGroup.style.border = 'none';
    if (errorDiv) errorDiv.style.display = 'none';
  }
});

  continueBtn?.addEventListener('click', async function (e) {
    e.preventDefault();

    continueBtn.disabled = true;
    const originalText = continueBtn.textContent;
    continueBtn.textContent = 'Processing...';

    let isValid = true;
    const cardholderInput = document.getElementById('cardholder-name');
    const errorDiv = cardholderInput.closest('.input-field')?.querySelector('.card-error');
    const inputGroup = cardholderInput.closest('.input-group');

    if (!cardholderInput.value.trim()) {
      inputGroup.style.border = '1px solid red';
      if (errorDiv) errorDiv.style.display = 'block';
      isValid = false;
    } else {
      inputGroup.style.border = 'none';
      if (errorDiv) errorDiv.style.display = 'none';
    }

    const testToken = await stripe.createToken(cardNumberElement, {
      name: cardholderInput.value || undefined,
    });

    handleStripeError(testToken, 'card-number');

    if (testToken.error) {
      isValid = false;
    }

    if (!isValid) {
      continueBtn.disabled = false;
      continueBtn.textContent = originalText;
      return;
    }

    const { token, error } = testToken;

    if (error || !token) {
      console.error(error?.message || 'Stripe token error');
      continueBtn.disabled = false;
      continueBtn.textContent = originalText;
      return;
    }


    try {
      const payload = {
        token: token.id,
        user_email: email?.value || "",
        price_id: selectedProduct.priceId
      };

      console.log("Sending subscription request with payload:", payload);

      const res = await fetch("https://oneccleanerapp.com/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Subscription failed');
      }
      
      function generateClickId(length = 10) {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
      }

      const clickId = generateClickId();
      window.location.href = `https://novawera.com/click?click_id=${clickId}&app_id=1530173098&link_id=rvslu1`;

      // window.location.href = 'https://apps.apple.com/us/id1530173098';
    } catch (err) {
      console.error(err);
      alert('Error: ' + err.message);
    }

    continueBtn.disabled = false;
    continueBtn.textContent = originalText;
  });
  
  // Mobile menu
  let burger = document.querySelector('.hero-section .header .burger-menu');
  let mobileMenu = document.querySelector('.mobile-menu-popup'),
  closeBtn = document.querySelector('.mobile-menu-popup .close-btn');
  
  burger.addEventListener('click', function() {
    mobileMenu.classList.toggle('active');
  })
  
  mobileMenu.addEventListener('click', function(event) {
    if(event.target === mobileMenu) {
      event.stopPropagation();
    mobileMenu.classList.remove('active');
    }
  })
  
  closeBtn.addEventListener('click', function() {
    mobileMenu.classList.remove('active');
  })
  
  
  function updateBarHeight() {
    const bar = document.querySelector('.bar');
    if (!bar) { return; }
    
    const barImg1 = document.querySelector('.bar-img-1');
    const barImg2 = document.querySelector('.bar-img-2');
    const barImg3 = document.querySelector('.bar-img-3');
    
    const wrapper = document.querySelector('.content-with-bar');
    const specialTitle1 = document.querySelector('.special-title-1');
    const specialTitle2 = document.querySelector('.special-title-2');
    const specialTitle3 = document.querySelector('.special-title-3');
    
    const wrapperTop = wrapper.getBoundingClientRect().top;
    const title1_rect = specialTitle1.getBoundingClientRect();
    const title2_rect = specialTitle2.getBoundingClientRect();
    const title3_rect = specialTitle3.getBoundingClientRect();
    
    const title1_center = title1_rect.top + title1_rect.height / 2 - wrapperTop;
    const title2_center = title2_rect.top + title2_rect.height / 2 - wrapperTop;
    const title3_center = title3_rect.top + title3_rect.height / 2 - wrapperTop;
    const title3_bottom = title3_rect.bottom - wrapperTop + 10;
    
    bar.style.height = `${title3_bottom}px`;
    
    barImg1.style.top = `${title1_center}px`;
    barImg2.style.top = `${title2_center}px`;
    barImg3.style.top = `${title3_center}px`;
  }
  
  window.addEventListener('load', updateBarHeight);
  window.addEventListener('resize', updateBarHeight);

  window.addEventListener('load', (event) => {
    setTimeout(() => {
      mobileMenu.classList.remove('init');
    });
  

    // section2.classList.remove('hidden-section');
    // section2.classList.add('hidden-section');
    // section1.remove();
    // section3.classList.remove('hidden-section');
    // secureSection.classList.add('hidden-section');
    // emailSection.classList.add('hidden-section');
    // checkoutSection.classList.remove('hidden-section');
    // section3.classList.remove('block-scroll');
    // startCountdownFromTenMinutes();
    // requestAnimationFrame(animateProgress);
    // storageContainer.classList.add('hidden-section');
    // completedContainer.classList.remove('hidden-section');
  });

})
let stripe, elements, cardNumberElement, cardExpiryElement, cardCvcElement;

function mountStripe() {
  stripe = Stripe('pk_test_51RSx5cQa9ru2DPNTllDHey2JxXXPgYhaDjq3AdGQ2gqbvDWQ2dsxDCdpXUq8MWc23H0qBGHee3WOa62vGwpIsBuK00uxrU2ztF');

  const style = {
    invalid: {
      color: '#B41B00',
    }
  };

  elements = stripe.elements();

  cardNumberElement = elements.create('cardNumber', {style});
  cardNumberElement.mount('#card-number-element');

  cardExpiryElement = elements.create('cardExpiry', {style});
  cardExpiryElement.mount('#card-expiry-element');

  cardCvcElement = elements.create('cardCvc', {style});
  cardCvcElement.mount('#card-cvc-element');

  cardNumberElement.on('change', (event) => handleStripeError(event, 'card-number'));
  cardExpiryElement.on('change', (event) => handleStripeError(event, 'expiry'));
  cardCvcElement.on('change', (event) => handleStripeError(event, 'cvc'));
}

let paymentRequest;
let canUseApplePay = false;

function updateSelectedProduct(product) {
  selectedProduct = product;

  if (paymentRequest) {
    paymentRequest.update({
      total: {
        label: 'Subscription',
        amount: getSelectedAmount()
      }
    });
  }
}

function getSelectedAmount() {
  return selectedProduct ? selectedProduct.amount : 699;
}

function setupApplePay() {
  paymentRequest = stripe.paymentRequest({
    country: 'US',
    currency: 'usd',
    total: {
      label: 'Subscription',
      amount: getSelectedAmount(),
    },
    requestPayerName: true,
    requestPayerEmail: true,
  });

  const prButton = elements.create('paymentRequestButton', {
    paymentRequest: paymentRequest,
  });

  const appleBtn = document.querySelector('.apple-btn');

  if (!appleBtn.dataset.listenerAdded) {
    appleBtn.addEventListener('click', () => {
      if (canUseApplePay) {
        paymentRequest.show();
      } else {
        alert('Apple Pay is not available on this device or browser. Please use a credit card.');
      }
    });
    appleBtn.dataset.listenerAdded = 'true';
  }

  paymentRequest.canMakePayment().then(function(result) {
    canUseApplePay = result && result.applePay;
  });

  paymentRequest.on('paymentmethod', async (ev) => {
    const userEmail = email?.value?.trim();
    try {
      const response = await fetch('https://oneccleanerapp.com/subscribe-applepay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_method: ev.paymentMethod.id,
          user_email: userEmail,
          price_id: selectedProduct?.priceId
        })
      });

      const result = await response.json();

      if (result.success) {
        ev.complete('success');
        alert('Subscription successful!');
      } else {
        ev.complete('fail');
        alert('Subscription failed: ' + result.error);
      }
    } catch (err) {
      ev.complete('fail');
      alert('Error: ' + err.message);
    }
  });
}

function handleStripeError(event, fieldId) {
  const errorElement = document.getElementById(`${fieldId}-error`);
  const fieldElement = document.getElementById(`${fieldId}-field`);

  if (event.error) {
    if (errorElement) {
      errorElement.textContent = event.error.message;
      errorElement.style.display = 'block';
    }
    if (fieldElement) {
      fieldElement.style.border = '1px solid red';
    }
  } else {
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
    if (fieldElement) {
      fieldElement.style.border = 'none';
    }
  }
}
