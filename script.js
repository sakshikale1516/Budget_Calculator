// JavaScript code (script.js)

document.addEventListener("DOMContentLoaded", function () {
  let totalAmount = document.getElementById("total-amount");
  let userAmount = document.getElementById("user-amount");
  const checkAmountButton = document.getElementById("check-amount");
  const totalAmountButton = document.getElementById("total-amount-button");
  const productTitle = document.getElementById("product-title");
  const errorMessage = document.getElementById("budget-error");
  const productTitleError = document.getElementById("product-title-error");
  const amount = document.getElementById("amount");
  const expenditureValue = document.getElementById("expenditure-value");
  const balanceValue = document.getElementById("balance-amount");
  const list = document.getElementById("list");

  const chartData = {
    labels: [],
    data: [],
    backgroundColor: [],
    borderColor: [],
  };
  let myChart;

  let tempAmount = 0;

  // Set Budget Part
  totalAmountButton.addEventListener("click", () => {
    tempAmount = totalAmount.value;
    if (tempAmount === "" || tempAmount < 0) {
      errorMessage.classList.remove("hide");
    } else {
      errorMessage.classList.add("hide");
      amount.innerHTML = tempAmount;
      balanceValue.innerText = tempAmount - expenditureValue.innerText;
      totalAmount.value = "";
      initializeChart();
    }
  });

  // Function To Disable Edit and Delete Button
  const disableButtons = (bool) => {
    let editButtons = document.getElementsByClassName("edit");
    Array.from(editButtons).forEach((element) => {
      element.disabled = bool;
    });
  };

  // Function To Modify List Elements
  const modifyElement = (element, edit = false) => {
    let parentDiv = element.parentElement;
    let currentBalance = balanceValue.innerText;
    let currentExpense = expenditureValue.innerText;
    let parentAmount = parentDiv.querySelector(".amount").innerText;
    if (edit) {
      let parentText = parentDiv.querySelector(".product").innerText;
      productTitle.value = parentText;
      userAmount.value = parentAmount;
      disableButtons(true);
    }
    balanceValue.innerText = parseInt(currentBalance) + parseInt(parentAmount);
    expenditureValue.innerText =
      parseInt(currentExpense) - parseInt(parentAmount);
    parentDiv.remove();
    updateChart();
  };

  // Function To Create List
  const listCreator = (expenseName, expenseValue) => {
    let sublistContent = document.createElement("div");
    sublistContent.classList.add("sublist-content", "flex-space");
    list.appendChild(sublistContent);
    sublistContent.innerHTML = `<p class="product">${expenseName}</p><p class="amount">${expenseValue}</p>`;
    let editButton = document.createElement("button");
    editButton.classList.add("fa-solid", "fa-pen-to-square", "edit");
    editButton.style.fontSize = "1.2em";
    editButton.addEventListener("click", () => {
      modifyElement(editButton, true);
    });
    let deleteButton = document.createElement("button");
    deleteButton.classList.add("fa-solid", "fa-trash-can", "delete");
    deleteButton.style.fontSize = "1.2em";
    deleteButton.addEventListener("click", () => {
      modifyElement(deleteButton);
    });
    sublistContent.appendChild(editButton);
    sublistContent.appendChild(deleteButton);
    document.getElementById("list").appendChild(sublistContent);
    updateChart();
  };

  // Function To Add Expenses
  checkAmountButton.addEventListener("click", () => {
    if (!userAmount.value || !productTitle.value) {
      productTitleError.classList.remove("hide");
      return false;
    }
    disableButtons(false);
    let expenditure = parseInt(userAmount.value);
    let sum = parseInt(expenditureValue.innerText) + expenditure;
    expenditureValue.innerText = sum;
    const totalBalance = tempAmount - sum;
    balanceValue.innerText = totalBalance;
    listCreator(productTitle.value, userAmount.value);
    productTitle.value = "";
    userAmount.value = "";
  });

  // Update chart data
  const updateChartData = () => {
    chartData.labels = [];
    chartData.data = [];
    chartData.backgroundColor = [];
    chartData.borderColor = [];

    // Define colors relevant to a blue background
    const relevantColors = [
      "#ff9999",
      "#ffcc66",
      "#ffff66",
      "#66ff99",
      "#66ccff",
      "#6666ff",
      "#cc66ff",
      "#ff66cc",
    ];

    if (parseFloat(expenditureValue.innerText) > 0) {
      // If there are expenses, add them to the chart data
      const expenseItems = document.querySelectorAll(".sublist-content");
      expenseItems.forEach((item, index) => {
        const expenseName = item.querySelector(".product").innerText;
        const expenseValue = parseInt(item.querySelector(".amount").innerText);
        chartData.labels.push(expenseName);
        chartData.data.push(expenseValue);
        // Use different colors for each expense
        const color = relevantColors[index % relevantColors.length];
        chartData.backgroundColor.push(color);
        chartData.borderColor.push(color);
      });
    }

    // Always display balance data
    chartData.labels.push("Balance");
    chartData.data.push(parseFloat(balanceValue.innerText));
    chartData.backgroundColor.push("#ffd700"); // Solid Yellow
    chartData.borderColor.push("#ffd700"); // Solid Yellow
  };

  // Function to update the chart
  const updateChart = () => {
    updateChartData();
    if (myChart) {
      myChart.data.labels = chartData.labels;
      myChart.data.datasets[0].data = chartData.data;
      myChart.data.datasets[0].backgroundColor = chartData.backgroundColor;
      myChart.data.datasets[0].borderColor = chartData.borderColor;
      myChart.update();
    }
  };

  // Function to initialize the chart
  const initializeChart = () => {
    updateChartData();
    const ctx = document.querySelector(".my-chart").getContext("2d");
    myChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: "Budget Overview",
            data: chartData.data,
            backgroundColor: chartData.backgroundColor,
            borderColor: chartData.borderColor,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
          title: {
            display: true,
            text: "Budget Overview",
          },
        },
      },
    });
  };
});
