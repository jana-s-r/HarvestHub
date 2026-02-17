$.noConflict();
(function (jQuery) {
  jQuery.Shop = function (element) {
    this.jQueryelement = jQuery(element);
    this.init();
  };

  jQuery.Shop.prototype = {
    init: function () {
      this.cartPrefix = "Furniture-";
      this.cartName = this.cartPrefix + "cart";
      this.shippingRates = this.cartPrefix + "shipping-rates";
      this.total = this.cartPrefix + "total";
      this.storage = sessionStorage;

      this.jQueryformAddToCart = this.jQueryelement.find("form.add-to-cart");
      this.jQueryformCart = this.jQueryelement.find("#shopping-cart");
      this.jQuerycheckoutCart = this.jQueryelement.find("#checkout-cart");
      this.jQuerycheckoutOrderForm = this.jQueryelement.find("#checkout-order-form");
      this.jQueryshipping = this.jQueryelement.find("#sshipping");
      this.jQuerysubTotal = this.jQueryelement.find("#stotal");
      this.jQueryshoppingCartActions = this.jQueryelement.find("#shopping-cart-actions");
      this.jQueryupdateCartBtn = this.jQueryshoppingCartActions.find("#update-cart");
      this.jQueryemptyCartBtn = this.jQueryshoppingCartActions.find("#empty-cart");
      this.jQueryuserDetails = this.jQueryelement.find("#user-details-content");

      this.currency = "₹";
      this.currencyString = "₹";

      this.requiredFields = {
        expression: {
          value: /^([\w-\.]+)@((?:[\w]+\.)+)([a-z]){2,4}$/
        },
        str: {
          value: ""
        }
      };

      this.createCart();
      this.handleAddToCartForm();
      this.handleCheckoutOrderForm();
      this.emptyCart();
      this.updateCart();
      this.displayCart();
      this.deleteProduct();
      this.displayUserDetails();
    },

    createCart: function () {
      if (this.storage.getItem(this.cartName) == null) {
        var cart = {};
        cart.items = [];
        this.storage.setItem(this.cartName, this._toJSONString(cart));
        this.storage.setItem(this.shippingRates, "0");
        this.storage.setItem(this.total, "0");
      }
    },

    displayUserDetails: function () {
      if (this.jQueryuserDetails.length) {
        if (this.storage.getItem("shipping-name") == null) {
          var firstname = this.storage.getItem("billing-firstname");
          var lastname = this.storage.getItem("billing-lastname");
          var email = this.storage.getItem("billing-email");
          var address = this.storage.getItem("billing-address");
          var zip = this.storage.getItem("billing-zip");
          var country = this.storage.getItem("billing-country");

          var html = "<div class='detail'><ul>";
          html += "<li><strong>First name:</strong> " + firstname + "</li>";
          html += "<li><strong>Last name:</strong> " + lastname + "</li>";
          html += "<li><strong>Email:</strong> " + email + "</li>";
          html += "<li><strong>Address:</strong> " + address + "</li>";
          html += "<li><strong>ZIP Code:</strong> " + zip + "</li>";
          html += "<li><strong>Country:</strong> " + country + "</li>";
          html += "</ul></div>";

          this.jQueryuserDetails[0].innerHTML = html;
        } else {
          var firstname = this.storage.getItem("billing-firstname");
          var lastname = this.storage.getItem("billing-lastname");
          var email = this.storage.getItem("billing-email");
          var address = this.storage.getItem("billing-address");
          var zip = this.storage.getItem("billing-zip");
          var country = this.storage.getItem("billing-country");

          var sFirstname = this.storage.getItem("shipping-firstname");
          var sLastname = this.storage.getItem("shipping-lastname");
          var sEmail = this.storage.getItem("shipping-email");
          var sAddress = this.storage.getItem("shipping-address");
          var sZip = this.storage.getItem("shipping-zip");
          var sCountry = this.storage.getItem("shipping-country");

          var html = "<div class='detail'><h2>Billing Address</h2><ul>";
          html += "<li>" + firstname + "</li>";
          html += "<li>" + lastname + "</li>";
          html += "<li>" + email + "</li>";
          html += "<li>" + address + "</li>";
          html += "<li>" + zip + "</li>";
          html += "<li>" + country + "</li>";
          html += "</ul></div>";

          html += "<div class='detail right'><h2>Shipping Address</h2><ul>";
          html += "<li>" + sFirstname + "</li>";
          html += "<li>" + sLastname + "</li>";
          html += "<li>" + sEmail + "</li>";
          html += "<li>" + sAddress + "</li>";
          html += "<li>" + sZip + "</li>";
          html += "<li>" + sCountry + "</li>";
          html += "</ul></div>";

          this.jQueryuserDetails[0].innerHTML = html;
        }
      }
    },

    deleteProduct: function () {
      var self = this;
      if (self.jQueryformCart.length) {
        var cart = this._toJSONObject(this.storage.getItem(this.cartName));
        var items = cart.items;

        jQuery(document).on("click", ".pdelete a", function (e) {
          e.preventDefault();
          var productName = jQuery(this).data("product");

          for (var i = 0; i < items.length; ++i) {
            if (items[i].product == productName) {
              items.splice(i, 1);
            }
          }

          var updatedTotal = 0;
          var totalQty = 0;

          for (var j = 0; j < items.length; ++j) {
            var prod = items[j];
            updatedTotal += prod.price * prod.qty;
            totalQty += prod.qty;
          }

          self.storage.setItem(self.total, self._convertNumber(updatedTotal));
          self.storage.setItem(self.shippingRates, self._convertNumber(self._calculateShipping(totalQty)));
          self.storage.setItem(self.cartName, self._toJSONString({ items: items }));

          jQuery(this).parents("tr").remove();
          self.jQuerysubTotal[0].innerHTML = self.currency + " " + self.storage.getItem(self.total);
        });
      }
    },

    displayCart: function () {
      if (this.jQueryformCart.length) {
        var cart = this._toJSONObject(this.storage.getItem(this.cartName));
        var items = cart.items;
        var table = this.jQueryformCart.find(".shopping-cart tbody");

        table.html("");

        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          var html = "<tr><td class='pname'>" + item.product + "</td>";
          html += "<td class='pqty'><input type='text' value='" + item.qty + "' class='qty'/> Kg</td>";
          html += "<td class='pprice'>" + this.currency + " " + item.price + ".00</td>";
          html += "<td class='pdelete'><a href='' data-product='" + item.product + "'>×</a></td></tr>";
          table.append(html);
        }

        this.jQuerysubTotal[0].innerHTML = this.currency + " " + this.storage.getItem(this.total);
      }
    },

    emptyCart: function () {
      var self = this;
      if (self.jQueryemptyCartBtn.length) {
        self.jQueryemptyCartBtn.on("click", function () {
          self._emptyCart();
        });
      }
    },

    updateCart: function () {
      var self = this;
      if (self.jQueryupdateCartBtn.length) {
        self.jQueryupdateCartBtn.on("click", function () {
          var rows = self.jQueryformCart.find("tbody tr");
          var updatedCart = { items: [] };
          var updatedTotal = 0;
          var totalQty = 0;

          rows.each(function () {
            var row = jQuery(this);
            var pname = jQuery.trim(row.find(".pname").text());
            var pqty = self._convertString(row.find(".qty").val());
            var pprice = self._convertString(self._extractPrice(row.find(".pprice")));

            updatedCart.items.push({ product: pname, price: pprice, qty: pqty });

            updatedTotal += pqty * pprice;
            totalQty += pqty;
          });

          self.storage.setItem(self.total, self._convertNumber(updatedTotal));
          self.storage.setItem(self.shippingRates, self._convertNumber(self._calculateShipping(totalQty)));
          self.storage.setItem(self.cartName, self._toJSONString(updatedCart));
        });
      }
    },

    handleAddToCartForm: function () {
      var self = this;
      self.jQueryformAddToCart.each(function () {
        var form = jQuery(this);
        var product = form.parent();
        var price = self._convertString(product.data("price"));
        var name = product.data("name");

        form.on("submit", function () {
          var qty = self._convertString(form.find(".qty").val());
          var subTotal = qty * price;
          var total = self._convertString(self.storage.getItem(self.total));
          self.storage.setItem(self.total, total + subTotal);

          self._addToCart({ product: name, price: price, qty: qty });

          var shipping = self._convertString(self.storage.getItem(self.shippingRates));
          self.storage.setItem(self.shippingRates, shipping + self._calculateShipping(qty));
        });
      });
    },

    handleCheckoutOrderForm: function () {
      var self = this;
      if (self.jQuerycheckoutOrderForm.length) {
        jQuery("#same-as-billing").on("change", function () {
          if (jQuery(this).prop("checked")) {
            jQuery("#fieldset-shipping").slideUp();
          } else {
            jQuery("#fieldset-shipping").slideDown();
          }
        });

        self.jQuerycheckoutOrderForm.on("submit", function () {
          if (!self._validateForm(jQuery(this))) return false;
          self._saveFormData(jQuery(this));
        });
      }
    },

    _emptyCart: function () {
      this.storage.clear();
    },

    _extractPrice: function (element) {
      return element.text().replace(this.currencyString, "").replace(" ", "");
    },

    _convertString: function (numStr) {
      var num = Number(numStr);
      return isNaN(num) ? 0 : num;
    },

    _convertNumber: function (n) {
      return n.toString();
    },

    _toJSONObject: function (str) {
      return JSON.parse(str);
    },

    _toJSONString: function (obj) {
      return JSON.stringify(obj);
    },

    _addToCart: function (values) {
      var cart = this._toJSONObject(this.storage.getItem(this.cartName));
      cart.items.push(values);
      this.storage.setItem(this.cartName, this._toJSONString(cart));
    },

    _calculateShipping: function (qty) {
      if (qty > 60) return 0;
      if (qty >= 30) return 30;
      if (qty >= 12) return 20;
      if (qty >= 4) return 10;
      return 100;
    },

    _validateForm: function (form) {
      var self = this;
      var valid = true;
      form.find(".message").remove();

      form.find("fieldset:visible :input").each(function () {
        var input = jQuery(this);
        var type = input.data("type");
        var msg = input.data("message");

        if (type == "string") {
          if (!input.val()) {
            jQuery("<span class='message'/>").text(msg).insertBefore(input);
            valid = false;
          }
        } else {
          if (!self.requiredFields.expression.value.test(input.val())) {
            jQuery("<span class='message'/>").text(msg).insertBefore(input);
            valid = false;
          }
        }
      });

      return valid;
    },

    _saveFormData: function (form) {
      var self = this;
      form.find("fieldset:visible").each(function () {
        var set = jQuery(this);

        if (set.is("#fieldset-billing")) {
          self.storage.setItem("billing-firstname", jQuery("#firstname", set).val());
          self.storage.setItem("billing-lastname", jQuery("#lastname", set).val());
          self.storage.setItem("billing-email", jQuery("#email", set).val());
          self.storage.setItem("billing-address", jQuery("#address", set).val());
          self.storage.setItem("billing-zip", jQuery("#zip", set).val());
          self.storage.setItem("billing-country", jQuery("#country", set).val());
        } else {
          self.storage.setItem("shipping-firstname", jQuery("#sfirstname", set).val());
          self.storage.setItem("shipping-lastname", jQuery("#slastname", set).val());
          self.storage.setItem("shipping-email", jQuery("#semail", set).val());
          self.storage.setItem("shipping-address", jQuery("#saddress", set).val());
          self.storage.setItem("shipping-zip", jQuery("#szip", set).val());
          self.storage.setItem("shipping-country", jQuery("#scountry", set).val());
        }
      });
    }
  };

  jQuery(function () {
    new jQuery.Shop("#site");
  });
})(jQuery);
