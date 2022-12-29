// 1. Gán biến cho các nodes
const data_form = document.querySelector("#data-form");
const data_input = document.querySelector(".add-task");
const render = document.querySelector("#task");
const submit = document.querySelector(".submit");

// 2. tạo data array demo, định hình cấu trúc data
let data_arr = [];

// 4. Tạo function để lưu data
const saveData = (data_arr) => {
  localStorage.setItem("TASK", JSON.stringify(data_arr));
};

// 5. Tạo function để get data
const loadData = () => {
  let data;
  data = JSON.parse(localStorage.getItem("TASK"));
  data = data ? data : [];
  return data;
};

// 6. Tạo một function để add new task
const addTask = (new_task) => {
  let data;
  data = loadData();
  data.unshift(new_task);
  saveData(data);
  clearInput();
};

const clearInput = () => {
  data_input.value = "";
};

// 7. Tạo function validate input
const validateData = () => {
  let isValidate = true;
  if (data_input.value.trim() === "") {
    alert("Please enter your task!");
    isValidate = false;
  }
  return isValidate;
};

// 9. Tạo function markTaskComplete
const markTaskComplete = (index) => {
  let data = loadData();
  data[index].is_complete = data[index].is_complete == true ? false : true;
  saveData(data);
  // console.log(data[index]);
  renderTask();
};
// sau khi mark task phải render lại data thì nó mới hiện ra

// tham số i đại diện cho this
const deleteItem = (i, index) => {
  let delete_confirm = confirm("Are you sure?");
  // confirm sẽ trả về true hoặc false
  // nếu trả về false tức là cancel thì sẽ ko thực hiện hành động tiếp theo
  // nếu trả về true tức là ok thì thực hiện hành động tiếp theo là xoá pt trong local
  if (delete_confirm == false) return false;
  let data = loadData(index);
  data.splice(index, 1);
  saveData(data);
  i.closest(".task-item").remove();
  renderTask();
  data_input.value = "";
};

// Hàm này có chức năng chọn ra task theo index
const pushItem = (index) => {
  // console.log(submit);
  let data = loadData();
  // đẩy data lên bằng cách lấy ra data input theo data có key là task và index
  data_input.value = data[index].task;
  // sau đó thêm vào thuộc tính index có value là index
  data_input.setAttribute("index", index);
  data_input.focus();
  submit.value = "EDIT TASK";
};

// Hàm edit task
const editTask = (task, index) => {
  let data = loadData();
  data[index].task = task;
  saveData(data);
  clearInput();
  submit.value = "ADD TASK";
};

// Thoát khỏi trạng thái edit bằng phím Esc
document.addEventListener("keydown", (e) => {
  // console.log(e.key);
  if (e.key === "Escape") {
    data_input.value = "";
    data_input.removeAttribute("index");
    submit.value = "ADD TASK";
  }
});

// 3. Tạo function chứa event submit
data_form.addEventListener("submit", (e) => {
  // Lấy data input
  data_input.value;
  // console.log(data_input.value);

  // gán biến index cho task có thuộc tính là index
  const index = data_input.getAttribute("index");
  if (index) {
    editTask(data_input.value, index);
    data_input.removeAttribute("index");
  } else {
    new_task = {
      task: data_input.value,
      is_complete: false,
    };
    let validate = validateData(new_task);
    if (validate) {
      addTask(new_task);
      clearInput();
    }
  }

  // 8. Render
  renderTask();

  e.preventDefault();
});

let renderTask = () => {
  let comment = document.querySelector(".comment");
  let count_complete = 0;
  let data = loadData();
  const renderData = data.map((i, index) => {
    if (i.is_complete == true) count_complete++;
    return `<div class='task-item' index=${index} is-complete=${i.is_complete}>
      <span class="checked-task" onClick='markTaskComplete(${index}) '>${i.task}</span>
      <div class="icon">
         <i onClick='pushItem(${index})' class="fa fa-pencil fa-lg edit" aria-hidden="true"></i>
         <i onClick='deleteItem(this, ${index})' class="fa fa-trash-o fa-lg delete" aria-hidden="true"></i>
      </div>
    </div>`;
  });
  comment.innerText =
    count_complete > 0
      ? `Congratulation!, ${count_complete} task completed`
      : "";
  render.innerHTML = renderData.join(" ");
};
