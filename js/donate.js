//pass your public key from tap's dashboard
var tap = Tapjsli('pk_test_pahBWFfY6rkU4ZIitP8EQOGm');

var elements = tap.elements({});

var style = {
  base: {
    color: '#535353',
    lineHeight: '18px',
    fontFamily: 'sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: 'rgba(0, 0, 0, 0.26)',
      fontSize:'15px'
    }
  },
  invalid: {
    color: 'red'
  }
};
// input labels/placeholders
var labels = {
    cardNumber:"Card Number",
    expirationDate:"MM/YY",
    cvv:"CVV",
    cardHolder:"Card Holder Name"
  };
//payment options
var paymentOptions = {
  currencyCode:["USD"],
  labels : labels,
  TextDirection:'ltr'
}
//create element, pass style and payment options
var card = elements.create('card', {style: style},paymentOptions);
//mount element
card.mount('#element-container');
//card change event listener
card.addEventListener('change', function(event) {
  if(event.loaded){
    console.log("UI loaded :"+event.loaded);
    console.log("current currency is :"+card.getCurrency())
  }
  var displayError = document.getElementById('error-handler');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

// Handle form submission
var form = document.getElementById('form-container');
form.addEventListener('submit', function(event) {
    event.preventDefault();

    //validate amount
    var errorElement = document.getElementById('error-handler');
    var successElement = document.getElementById('success');
    var amountElm = $(form).find("input[name=amount]");
    if (!amountElm.length) {
        errorElement.textContent = "Please enter an amount";
        return;
    }
    var amountVal = amountElm.val();
    if (isNaN(amountVal) || parseFloat(amountVal) < 0) {
        errorElement.textContent = "Please enter an amount greater than 0";
        return;
    }

    var button = $("#tap-btn");
    button.prop('disabled', true);

    tap.createToken(card).then(function(result) {
        console.log(result);
        if (result.error) {
            // Inform the user if there was an error
            errorElement.textContent = result.error.message;
            button.prop('disabled', false);
        } else {
            // Send the token to your server
            
            $.post('https://quran-extension-api.alwaysdata.net/donate', {amount: amountVal, tapToken: result.id}, function (response) {
              console.log(response);
              if (response.success) {
                successElement.textContent = 'Thank you for your donation!';
              } else {
                errorElement.textContent = response.error;
              }
              button.prop('disabled', false);
            });
        }
    });
});