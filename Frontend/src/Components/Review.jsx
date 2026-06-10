import { useEffect, useState } from "react";
import "./Review.css";

function Review() {
  const [currentReview, setCurrentReview] = useState(0);

  const reviews = [
    {
      name: "Priya",
      designation: "Head",
      rating: 5,
      review:
        "The quality of the fabric and the attention to detail is unmatched. I get compliments every single time I wear anything from this collection.",
    },
    {
      name: "Rahul",
      designation: "Manager",
      rating: 4,
      review: "Amazing collection and premium quality. Highly recommended.",
    },
    {
      name: "Anjali",
      designation: "Designer",
      rating: 5,
      review: "Beautiful designs and excellent craftsmanship.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const review = reviews[currentReview];

  return (
    <section className="review-section">
      <div className="stars">{"★".repeat(review.rating)}</div>

      <p className="review-text">"{review.review}"</p>

      <div className="review-author">
        <span>{review.name}</span>
        <span>{review.designation}</span>
      </div>

      <div className="slider-dots">
        {reviews.map((_, index) => (
          <span
            key={index}
            className={currentReview === index ? "dot active-dot" : "dot"}
          ></span>
        ))}
      </div>
    </section>
  );
}

export default Review;
