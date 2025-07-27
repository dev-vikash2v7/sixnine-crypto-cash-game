export default function(io) {
    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);
  
      socket.on("cashout", data => {
        
        socket.emit("cashout_received", { received: true });
      });
  
      socket.on("disconnect", () => { });
    });
  }
  