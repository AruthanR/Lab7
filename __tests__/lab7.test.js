describe('Basic user flow for Website', () => {
  // First, visit the lab 7 website
  beforeAll(async () => {
    await page.goto('https://cse110-sp25.github.io/CSE110-Shop/');
  });

  // Each it() call is a separate test
  // Here, we check to make sure that all 20 <product-item> elements have loaded
  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');

    // Query select all of the <product-item> elements and return the length of that array
    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });

    // Expect there that array from earlier to be of length 20, meaning 20 <product-item> elements where found
    expect(numProducts).toBe(20);
  });

  // Check to make sure that all 20 <product-item> elements have data in them
  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');

    // Start as true, if any don't have data, swap to false
    let allArePopulated = true;

    // Query select all of the <product-item> elements
    const prodItemsData = await page.$$eval('product-item', prodItems => {
      return prodItems.map(item => {
        // Grab all of the json data stored inside
        return data = item.data;
      });
    });

        console.log(`Checking product item 1/${prodItemsData.length}`);

    // Make sure the title, price, and image are populated in the JSON
    firstValue = prodItemsData[0];
    if (firstValue.title.length == 0) { allArePopulated = false; }
    if (firstValue.price.length == 0) { allArePopulated = false; }
    if (firstValue.image.length == 0) { allArePopulated = false; }

    // Expect allArePopulated to still be true
    expect(allArePopulated).toBe(true);

  
  }, 10000);

  // Check to make sure that when you click "Add to Cart" on the first <product-item> that
  // the button swaps to "Remove from Cart"
  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');

    const firstItem = await page.$('product-item');
    const shadow = await firstItem.getProperty('shadowRoot');
    const button = await shadow.$('button');

    await button.click();
    const buttonText = await (await button.getProperty('innerText')).jsonValue();
    expect(buttonText).toBe('Remove from Cart');

    await button.click(); // revert
  }, 2500);

  // Check to make sure that after clicking "Add to Cart" on every <product-item> that the Cart
  // number in the top right has been correctly updated
  it('Checking number of items in cart on screen', async () => {
    console.log('Checking number of items in cart on screen...');


    const items = await page.$$('product-item');
    for (const item of items) {
      const shadow = await item.getProperty('shadowRoot');
      const button = await shadow.$('button');
      const text = await (await button.getProperty('innerText')).jsonValue();
      if (text === 'Add to Cart') await button.click();
    }

    const cartCount = await (await (await page.$('#cart-count')).getProperty('innerText')).jsonValue();
    expect(cartCount).toBe('20');
  }, 15000);

  // Check to make sure that after you reload the page it remembers all of the items in your cart
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');


    await page.reload();

    const cartCount = await (await (await page.$('#cart-count')).getProperty('innerText')).jsonValue();
    expect(cartCount).toBe('20');

    const allButtonsCorrect = await page.$$eval('product-item', items => {
      return items.every(item => {
        const btn = item.shadowRoot.querySelector('button');
        return btn.innerText === 'Remove from Cart';
      });
    });

    expect(allButtonsCorrect).toBe(true);
  }, 10000);

  // Check to make sure that the cart in localStorage is what you expect
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');

  
    const cart = await page.evaluate(() => localStorage.getItem('cart'));
    expect(cart).toBe('[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]');
  });

  // Checking to make sure that if you remove all of the items from the cart that the cart
  // number in the top right of the screen is 0
  it('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Checking number of items in cart on screen after removing from cart...');

  

    const items = await page.$$('product-item');
    for (const item of items) {
      const shadow = await item.getProperty('shadowRoot');
      const button = await shadow.$('button');
      const text = await (await button.getProperty('innerText')).jsonValue();
      if (text === 'Remove from Cart') await button.click();
    }

    const cartCount = await (await (await page.$('#cart-count')).getProperty('innerText')).jsonValue();
    expect(cartCount).toBe('0');
  }, 15000);

  // Checking to make sure that it remembers us removing everything from the cart
  // after we refresh the page
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    await page.reload();

    const buttons = await page.$$('product-item >>> button');
    for (const btn of buttons) {
      const text = await (await btn.getProperty('innerText')).jsonValue();
      expect(text).toBe('Add to Cart');
    }

    const cartCount = await (await (await page.$('#cart-count')).getProperty('innerText')).jsonValue();
    expect(cartCount).toBe('0');
  }, 10000);

  // Checking to make sure that localStorage for the cart is as we'd expect for the
  // cart being empty
  it('Checking the localStorage to make sure cart is correct after removing items', async () => {
    console.log('Checking the localStorage after removing all items...');

    const cart = await page.evaluate(() => localStorage.getItem('cart'));
    expect(cart).toBe('[]');
  });
});
