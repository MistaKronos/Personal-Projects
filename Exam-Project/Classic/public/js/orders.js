// Function to open the edit modal and populate it with the current order status
function editOrder(orderId) {
  document.getElementById("edit-order-id").value = orderId;
  $("#editOrderModal").modal("show");
}

// Function to handle updating an order's status
function updateOrderStatus(event) {
  event.preventDefault();

  const orderId = document.getElementById("edit-order-id").value;
  const newStatus = document.getElementById("edit-order-status").value;

  fetch(`/orders/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newStatus: newStatus }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(() => {
      alert("Order status updated successfully");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error updating order:", error);
      alert("Failed to update order status. Please try again.");
    });
}

// Function to add a new order
function addOrder(event) {
  event.preventDefault();
  const orderName = document.getElementById("order-name").value;

  // Validate input
  if (!orderName.trim()) {
    alert("Order name cannot be empty.");
    return;
  }

  const orderData = {
    orderName: orderName,
  };

  fetch("/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      alert("Order created successfully: " + data.order.orderNumber);
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error creating order:", error);
      alert("Unable to create order. This function has not been added yet, I am still improving this webpage.");
    });
}

// Delete an order
function deleteOrder(orderId) {
  if (!confirm("Are you sure you want to delete this order?")) {
    return;
  }

  fetch(`/orders/${orderId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(() => {
      alert("Order deleted successfully");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error deleting order:", error);
      alert("Failed to delete order. Please try again.");
    });
}
