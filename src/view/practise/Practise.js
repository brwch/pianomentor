import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic, faDeaf, faHeadphonesSimple, faCubes, faQuestion } from "@fortawesome/free-solid-svg-icons";
import ExerciseTile from "./ExerciseTile";
import { UserAuth } from "../../authentication/AuthContext";

const Practise = () => {
  const { user, getTaskProgress } = UserAuth();
  const [exerciseProgress, setExerciseProgress] = useState([]);

  useEffect(() => {
    const fetchExerciseProgress = async () => {
      const progressData = await Promise.all(
        Array.from({ length: 18 }, (_, index) => getTaskProgress(index + 1, user))
      );
      setExerciseProgress(progressData);
    };

    if (user && user.uid) {
      fetchExerciseProgress();
    }
  }, [user, getTaskProgress]);

  return (
    <div className="Practise">

      <div className="exercise-flex">
        <ExerciseTile
          id={1}
          header="Czytanie nut I"
          description="Rozpoznaj nuty w kluczu wiolinowym"
          difficulty="Easy"
          icon={<FontAwesomeIcon icon={faMusic} />}
          progress={exerciseProgress[0]}
        />
        <ExerciseTile
          id={2}
          header="Czytanie nut II"
          description="Rozpoznaj nuty w kluczu wiolinowym"
          difficulty="Medium"
          icon={<FontAwesomeIcon icon={faMusic} />}
          progress={exerciseProgress[1]}
        />
        <ExerciseTile
          id={3}
          header="Czytanie nut III"
          description="Rozpoznaj nuty w kluczu wiolinowym"
          difficulty="Hard"
          icon={<FontAwesomeIcon icon={faMusic} />}
          progress={exerciseProgress[2]}
        />
        <ExerciseTile
          id={4}
          header="Czytanie nut IV"
          description="Rozpoznaj nuty w kluczu basowym"
          difficulty="Easy"
          icon={<FontAwesomeIcon icon={faMusic} />}
          progress={exerciseProgress[3]}
        />
        <ExerciseTile
          id={5}
          header="Czytanie nut V"
          description="Rozpoznaj nuty w kluczu basowym"
          difficulty="Medium"
          icon={<FontAwesomeIcon icon={faMusic} />}
          progress={exerciseProgress[4]}
        />
        <ExerciseTile
          id={6}
          header="Czytanie nut VI"
          description="Rozpoznaj nuty w kluczu basowym"
          difficulty="Hard"
          icon={<FontAwesomeIcon icon={faMusic} />}
          progress={exerciseProgress[5]}
        />
        <ExerciseTile
          id={7}
          header="Interwały I"
          description="Rozpoznaj usłyszaną odległość między dźwiękami"
          difficulty="Easy"
          icon={<FontAwesomeIcon icon={faDeaf} />}
          progress={exerciseProgress[6]}
        />
        <ExerciseTile
          id={8}
          header="Interwały II"
          description="Rozpoznaj usłyszaną odległość między dźwiękami"
          difficulty="Medium"
          icon={<FontAwesomeIcon icon={faDeaf} />}
          progress={exerciseProgress[7]}
        />
        <ExerciseTile
          id={9}
          header="Interwały III"
          description="Rozpoznaj usłyszaną odległość między dźwiękami"
          difficulty="Hard"
          icon={<FontAwesomeIcon icon={faDeaf} />}
          progress={exerciseProgress[8]}
        />
        <ExerciseTile
          id={10}
          header="Rozpoznanie melodii I"
          description="Wskaż usłyszaną melodię w reprezentacji nutowej"
          difficulty="Easy"
          icon={<FontAwesomeIcon icon={faHeadphonesSimple} />}
          progress={exerciseProgress[9]}
        />
        <ExerciseTile
          id={11}
          header="Rozpoznanie melodii II"
          description="Wskaż usłyszaną melodię w reprezentacji nutowej"
          difficulty="Medium"
          icon={<FontAwesomeIcon icon={faHeadphonesSimple} />}
          progress={exerciseProgress[10]}
        />
        <ExerciseTile
          id={12}
          header="Rozpoznanie melodii III"
          description="Wskaż usłyszaną melodię w reprezentacji nutowej"
          difficulty="Hard"
          icon={<FontAwesomeIcon icon={faHeadphonesSimple} />}
          progress={exerciseProgress[11]}
        />
        <ExerciseTile
          id={13}
          header="Rozpoznanie tonacji dur, moll I"
          description="Wskaż poprawną tonacje"
          difficulty="Easy"
          icon={<FontAwesomeIcon icon={faQuestion} />}
          progress={exerciseProgress[12]}
        />
        <ExerciseTile
          id={14}
          header="Rozpoznanie tonacji dur, moll II"
          description="Wskaż poprawną tonacje"
          difficulty="Medium"
          icon={<FontAwesomeIcon icon={faQuestion} />}
          progress={exerciseProgress[13]}
        />
        <ExerciseTile
          id={15}
          header="Rozpoznanie tonacji dur, moll III"
          description="Wskaż poprawną tonacje"
          difficulty="Hard"
          icon={<FontAwesomeIcon icon={faQuestion} />}
          progress={exerciseProgress[14]}
        />
        <ExerciseTile
          id={16}
          header="Akordy I"
          description="Zagraj prz pomocy klawiatury fortepianowej wskazany akord"
          difficulty="Easy"
          icon={<FontAwesomeIcon icon={faCubes} />}
          progress={exerciseProgress[15]}
        />
        <ExerciseTile
          id={17}
          header="Akordy II"
          description="Zagraj prz pomocy klawiatury fortepianowej wskazany akord"
          difficulty="Medium"
          icon={<FontAwesomeIcon icon={faCubes} />}
          progress={exerciseProgress[16]}
        />
        <ExerciseTile
          id={18}
          header="Akordy III"
          description="Zagraj prz pomocy klawiatury fortepianowej wskazany akord"
          difficulty="Hard"
          icon={<FontAwesomeIcon icon={faCubes} />}
          progress={exerciseProgress[17]}
        />
      </div>
    </div>
  );
};

export default Practise;