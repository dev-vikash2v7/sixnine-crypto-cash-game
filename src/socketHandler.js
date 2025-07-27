export default function(io) {
    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);
  
      socket.on("cashout", data => {
        // This should call the same controller action as REST endpoint,
        // but with socket feedback!
        // You can forward to controller or code logic here.
        // For demo: just send "cashout_received"
        socket.emit("cashout_received", { received: true });
      });
  
      socket.on("disconnect", () => { });
    });
  }
  