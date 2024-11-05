function loadSite() {
  loadList();
}

function addingNewProductFields() {
  const root = document.querySelector('#product-list')
  const newProductFields = createNewProductFields();
  root.insertAdjacentHTML('afterbegin', newProductFields)
}

function clearInputFields() {
  document.getElementById('new-product').reset();
}

async function loadList() {
  const root = document.querySelector('#product-list')
  root.innerText = "";
  const response = await fetch('/api/products/all');
  const products = await response.json();
  const data = products.products;

  const list = document.createElement('ul');

  const productNumber = document.createElement('h4');
  productNumber.innerText = "Number of items: " + data.length + " db";

  const addNewbutton = `<button style="margin-left:2%;" type="button" class="btn btn-success" onClick="document.getElementById('new-product').reset()" data-toggle="modal" data-target="#myModal">Add</button>`

  root.appendChild(productNumber);
  root.insertAdjacentHTML('beforeend', addNewbutton)

  const columnHeader = document.createElement('div')

  columnHeader.innerHTML = displayProductData({ id: "ID and", name: "Name", })

  data.forEach(element => {
    const li = document.createElement('li');
    li.classList.add('row')
    li.innerHTML = displayProductData(element);
    //li.innerText = `#${element.id}, ${element.name}, ${element.price}, ${element.category}`;
    li.dataset.productId = element.id;
    list.appendChild(li);
    const editButton = createButton(element, "EDIT", "Edit");
    //editButton.addEventListener('click', loadProductIntoEditor())
    const deleteButton = createButton(element, "DELETE", "Delete");

  });
  root.appendChild(list);
}

async function handleSubmit(e) {
  e.preventDefault();
  console.log("A submit has happened!");

  const method = e.submitter.getAttribute("data-method");

  if (method === "delete") {
    await fetch('/api/products/'+e.submitter.getAttribute('data-product-id'),
      {method : "DELETE"}
    );
    
    console.log(e.submitter.getAttribute('data-product-id'));
    await loadList();
  } else if (method === "patch") {
    const newProduct = createNewProductFromInputs(e.srcElement);
    await fetch('/api/products/'+e.submitter.getAttribute('data-product-id'), {
      method: "PATCH",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    })
  }
  else if (method === "post") {
    const newProduct = createNewProductFromInputs(e.srcElement);
    await fetch('/api/products/', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    })
    console.log(newProduct);
    await loadList();
  }

}

function createNewProductFromInputs(form) {
  return {
    "id": "",
    "name": form[0].value,
    "category": form[2].value,
    "price": Number.parseInt(form[1].value),
    "description": form[3].value,
    "image": form[4].value
  }
}

function createButton(p, method, text) {
  const button = document.createElement('button');
  button.innerText = text;
  button.mathod = method;
  button.dataset.productId = p.id;

  return button;
}

function displayProductData(p) {
  return `
    <form data-product-id="${p.id}" method="patch">
      <div class="form-group row">
        <label for="name" class="col-4 col-form-label">Name</label> 
        <div class="col-8">
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                <i class="fa fa-address-card"></i>
              </div>
            </div> 
            <input id="name" name="name" type="text" class="form-control" value="${p.name}">
          </div>
        </div>
      </div>
      <div class="form-group row">
        <label for="price" class="col-4 col-form-label">Price</label> 
        <div class="col-8">
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                <i class="fa fa-euro"></i>
              </div>
            </div> 
            <input id="price" name="price" type="text" class="form-control"  value="${p.price}">
          </div>
        </div>
      </div>
      <div class="form-group row">
        <label for="category" class="col-4 col-form-label">Category</label> 
        <div class="col-8">
            <div class="input-group">
                <div class="input-group-prepend">
                    <div class="input-group-text">
                        <i class="fa fa-book"></i>
                    </div>
                </div> 
            <input id="category" name="category" type="text" class="form-control"  value="${p.category}">
            </div>
        </div>
      </div>
      <div class="form-group row">
      <label for="description" class="col-4 col-form-label">Description</label> 
      <div class="col-8">
          <div class="input-group">
              <div class="input-group-prepend">
                  <div class="input-group-text">
                      <i class="fa fa-book"></i>
                  </div>
              </div> 
          <input id="description" name="description" type="text" class="form-control"  value="${p.description}">
          </div>
      </div>
    </div>
    <div class="form-group row">
      <label for="price" class="col-4 col-form-label">Image name</label> 
      <div class="col-8">
        <div class="input-group">
          <div class="input-group-prepend">
            <div class="input-group-text">
              <i class="fa fa-file-image-o"></i>
            </div>
          </div> 
          <input id="price" name="image" type="text" class="form-control"  value="${p.image}">
        </div>
      </div>
    </div> 
      <div class="form-group row">
        <div class="offset-4 col-8">
          <button name="submit" data-method="patch" type="submit" class="btn btn-primary" data-product-id="${p.id}">Save</button>
          <button name="delete" data-method="delete" class="btn btn-danger" data-product-id="${p.id}">Delete</button>
        </div>
      </div>
    </form>
    `;
  //submit handler
}

function createNewProductFields() {
  return `
    <form>
      <div class="form-group row">
        <label for="name" class="col-4 col-form-label">Name</label> 
        <div class="col-8">
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                <i class="fa fa-address-card"></i>
              </div>
            </div> 
            <input id="name" name="name" type="text" class="form-control" value="">
          </div>
        </div>
      </div>
      <div class="form-group row">
        <label for="price" class="col-4 col-form-label">Price</label> 
        <div class="col-8">
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                <i class="fa fa-euro"></i>
              </div>
            </div> 
            <input id="price" name="price" type="text" class="form-control"  value="">
          </div>
        </div>
      </div>
      <div class="form-group row">
        <label for="category" class="col-4 col-form-label">Category</label> 
        <div class="col-8">
            <div class="input-group">
                <div class="input-group-prepend">
                    <div class="input-group-text">
                        <i class="fa fa-book"></i>
                    </div>
                </div> 
            <input id="category" name="category" type="text" class="form-control"  value="">
            </div>
        </div>
      </div>
      <div class="form-group row">
        <label for="description" class="col-4 col-form-label">Description</label> 
        <div class="col-8">
            <div class="input-group">
                <div class="input-group-prepend">
                    <div class="input-group-text">
                        <i class="fa fa-book"></i>
                    </div>
                </div> 
            <input id="description" name="description" type="text" class="form-control"  value="">
            </div>
        </div>
      </div>
      <div class="form-group row">
        <label for="price" class="col-4 col-form-label">Image name</label> 
        <div class="col-8">
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                <i class="fa fa-file-image-o"></i>
              </div>
            </div> 
            <input id="price" name="image" type="text" class="form-control"  value="">
          </div>
        </div>
      </div>
      <div class="form-group row">
        <div class="offset-4 col-8">
          <button name="submit" type="submit" class="btn btn-primary">Save</button>
          <button name="cancel" onClick="cancelAddNewProduct(this)" class="btn btn-danger">Cancel</button>
        </div>
      </div>
    </form>
    `;
  //submit handler
}

window.addEventListener('load', () => loadSite());
window.addEventListener('submit', (event) => { handleSubmit(event) });