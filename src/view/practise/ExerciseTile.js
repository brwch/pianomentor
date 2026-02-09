import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import "./Practise.css";
import { UserAuth } from "../../authentication/AuthContext";

const ExerciseTile = ({ id, header, description, difficulty, icon, progress }) => {
  let color = "#28a745"; // default color for progress bar

  const { user } = UserAuth();

  if (progress <= 25) {
    color = "#dc3545"; // red
  } else if (progress <= 50) {
    color = "#E46E00"; // orange
  } else if (progress < 100) {
    color = "#28a745"; // green
  } else {
    color = "#E1B900"; // yellow
  }

  return (
    <Link to={`/practise/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="exercise-tile">
        <div className="exercise-header">{header}</div>
        <div className="exercise-description">{description}</div>
        <div className="exercise-difficulty">Stopień trudności: {difficulty}</div>
        <div className="exercise-icon">{icon}</div>
        {user ? (
          <>
            {progress === undefined ? (
              <div className="exercise-progress" style={{ color: "black" }}>
                <FontAwesomeIcon icon={faCircleNotch} spin style={{ fontSize: "1.25em" }} />
              </div>
            ) : (
              <>
                <div className="exercise-progress" style={{ color }}>
                  {progress === 100 ? <FontAwesomeIcon icon={faCrown} style={{ fontSize: "1.25em" }} /> : `${progress}%`}
                </div>
                <div className="progress-bar" style={{ backgroundColor: color, width: `${progress}%` }} />
              </>
            )}
          </>
        ) : (
          <div className="exercise-progress" style={{ color: "#6678db" }}>Postęp dostępny po zalogowaniu</div>
        )}
      </div>
    </Link>
  );
};

export default ExerciseTile;