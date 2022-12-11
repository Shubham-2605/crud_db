import prodb, {
    bulkcreate,
    createEle,
    getData,
    SortObj
  } from "./module.js";
  
  
  let db = prodb("Productdb", {
    products: `++id, name, Category Id, Category Name`
  });
  
  // input tags
  const userid = document.getElementById("userid");
  const proname = document.getElementById("proname");
  const CategoryId = document.getElementById("Category Id");
  const CategoryName = document.getElementById("Category Name ");
  
  // create button
  const btncreate = document.getElementById("btn-create");
  const btnread = document.getElementById("btn-read");
  const btnupdate = document.getElementById("btn-update");
  const btndelete = document.getElementById("btn-delete");
  
  // user data
  
  // event listerner for create button
  btncreate.onclick = event => {
    // To insert values
    let flag = bulkcreate(db.products, {
      name: proname.value,
      CategoryId: CategoryId.value,
      CategoryName: CategoryName.value
    });


    proname.value = CategoryId.value = CategoryName.value = "";
  
    // set id textbox value
    getData(db.products, data => {
      userid.value = data.id + 1 || 1;
    });
    table();
  
    let insertmsg = document.querySelector(".insertmsg");
    getMsg(flag, insertmsg);
  };
  
  // event listerner for create button
  btnread.onclick = table;
  
  // button update
  btnupdate.onclick = () => {
    const id = parseInt(userid.value || 0);
    if (id) {
      // call dexie update method
      db.products.update(id, {
        name: proname.value,
        CategoryId: CategoryId.value,
        CategoryName: CategoryName.value
      }).then((updated) => {
        // let get = updated ? `data updated` : `couldn't update data`;
        let get = updated ? true : false;
  
        let updatemsg = document.querySelector(".updatemsg");
        getMsg(get, updatemsg);
  
        proname.value = CategoryId.value = CategoryName.value = "";
        
      })
    } else {
      console.log(`Please Select id: ${id}`);
    }
  }
  
  // delete button
  btndelete.onclick = () => {
    db.delete();
    db = prodb("Productdb", {
      products: `++id, name, CategoryId, CategoryName`
    });
    db.open();
    table();
    textID(userid);
    // display message
    let deletemsg = document.querySelector(".deletemsg");
    getMsg(true, deletemsg);
  }
  
  window.onload = event => {
    // set id textbox value
    textID(userid);
  };
  
  
  
  
  // create dynamic table
  function table() {
    const tbody = document.getElementById("tbody");
    const notfound = document.getElementById("notfound");
    notfound.textContent = "";
    // remove all childs from the dom first
    while (tbody.hasChildNodes()) {
      tbody.removeChild(tbody.firstChild);
    }
  
  
    getData(db.products, (data, index) => {
      if (data) {
        createEle("tr", tbody, tr => {
          for (const value in data) {
            createEle("td", tr, td => {
              td.textContent = data.CategoryName === data[value] ? `$ ${data[value]}` : data[value];
            });
          }
          createEle("td", tr, td => {
            createEle("i", td, i => {
              i.className += "fas fa-edit btnedit";
              i.setAttribute(`data-id`, data.id);
              // store number of edit buttons
              i.onclick = editbtn;
            });
          })
          createEle("td", tr, td => {
            createEle("i", td, i => {
              i.className += "fas fa-trash-alt btndelete";
              i.setAttribute(`data-id`, data.id);
              // store number of edit buttons
              i.onclick = deletebtn;
            });
          })
        });
      } else {
        notfound.textContent = "No record found in the database...!";
      }
  
    });
  }
  
  const editbtn = (event) => {
    let id = parseInt(event.target.dataset.id);
    db.products.get(id, function (data) {
      let newdata = SortObj(data);
      userid.value = newdata.id || 0;
      proname.value = newdata.name || "";
      CategoryId.value = newdata.CategoryId || "";
      CategoryName.value = newdata.CategoryName || "";
    });
  }
  
  // delete icon remove element 
  const deletebtn = event => {
    let id = parseInt(event.target.dataset.id);
    db.products.delete(id);
    table();
  }
  
  // textbox id
  function textID(textboxid) {
    getData(db.products, data => {
      textboxid.value = data.id + 1 || 1;
    });
  }
  
  // function msg
  function getMsg(flag, element) {
    if (flag) {
      // call msg 
      element.className += " movedown";
  
      setTimeout(() => {
        element.classList.forEach(classname => {
          classname == "movedown" ? undefined : element.classList.remove('movedown');
        })
      }, 4000);
    }
  }