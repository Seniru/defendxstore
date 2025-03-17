const StockStatus = ({ stock }) => {
    let style;
    switch (stock) {
      case "In Stock":
        style = {
          width: "90px",
          backgroundColor: "#ffffff",
          color: "#09db65",
          padding: "5px",
          borderRadius: "20px",
          textAlign: "center",
          border: "3px solid #09db65",
        };
        break;
      case "Running Low":
        style = {
          width: "90px",
          backgroundColor: "white",
          color: "orange",
          padding: "5px",
          borderRadius: "20px",
          textAlign: "center",
          border: "3px solid orange",
        };
        break;
      case "Out of Stock":
        style = {
          width: "90px",
          backgroundColor: "white",
          color: "red",
          padding: "5px",
          borderRadius: "20px",
          textAlign: "center",
          border: "3px solid red",
        };
        break;
      default:
        style = {
          backgroundColor: "gray",
          color: "white",
          padding: "5px",
          borderRadius: "20px",
          textAlign: "center",
        };
    }
  
    return (
      <div style={style} className="stock-status">
        {stock}
      </div>
    );
  };