export const categoryTag = (item) => {
  if (item.category === "food") {
    return <div className="tag tag-food !text-xs !p-05">{item.category}</div>;
  }
  if (item.category === "entertainment") {
    return (
      <div className="tag tag-entertainment !text-xs !p-05">
        {item.category}
      </div>
    );
  }
  if (item.category === "household") {
    return (
      <div className="tag tag-household !text-xs !p-05">{item.category}</div>
    );
  }
  if (item.category === "transport") {
    return (
      <div className="tag tag-transport !text-xs !p-05">{item.category}</div>
    );
  }
  if (item.category === "other") {
    return <div className="tag tag-other !text-xs !p-05">{item.category}</div>;
  }

  if (item.category === "salary") {
    return <div className="tag tag-salary !text-xs !p-05">{item.category}</div>;
  } else if (item.category === "business") {
    return (
      <div className="tag tag-business !text-xs !p-05">{item.category}</div>
    );
  } else if (item.category === "extra-income") {
    return (
      <div className="tag tag-extra-income !text-xs !p-05">{item.category}</div>
    );
  } else if (item.category === "loan") {
    return <div className="tag tag-loan !text-xs !p-05">{item.category}</div>;
  } else if (item.category === "other") {
    return <div className="tag tag-other !text-xs !p-05">{item.category}</div>;
  }
};
