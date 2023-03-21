import badImg from "../../../public/img/typing-game/001bad.png";
import okImg from "../../../public/img/typing-game/003ok.png";
import goodImg from "../../../public/img/typing-game/002positive.png";
// import { shuffleArr } from "~/misc/helpers/tools/shuffle-arr";
import { parseRussian } from "~/misc/helpers/translation";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCheckCircle, faLevelDownAlt, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { arrorUturnDown } from "../common/media/svg";
import { type TestWord } from "~/routes/hsk/2/tests";
import { $, component$, useSignal } from "@builder.io/qwik";

type TypingGameProps = {
  words: TestWord[] | null;
  level: string;
};

export const QUEST_NUM = 10;

export const TypingGame = component$(({ words, level }: TypingGameProps) => {
  const questionNum = 1;
  const start = useSignal(false);
  const shuffledWords: TestWord[] = [];
  const progress = useSignal(0);
  const corrects = useSignal(0);
  const wrongs = useSignal(0);
  const resultWords = "";
  const wrongAnswers: string[] = [];
  const question: TestWord | null = null;
  const answer = "";

  // useEffect(() => {
  //   if (!words) return;
  //   testStarted(false);
  //   shuffleArr(words);
  //   const newArr = words.slice(0, QUEST_NUM);
  //   setShuffledWords(newArr);
  //   setQuestion(newArr[0]);
  // }, [words]);

  // useInterval(() => {
  //   if (!start) return;
  //   setProgress(progress + 0.5);
  //   if (progress >= 100) {
  //     skipQuestion();
  //   }
  // }, 100);

  // const setNewQuestion = () => {
  //   setProgress(0);
  //   setQuestion(shuffledWords![questionNum]);
  //   setQuestionNum(questionNum + 1);
  // };

  const skipQuestion = $(() => {
    // setWrongAnswers([...wrongAnswers, question!.chinese]);
    // setNewQuestion();
    // setWrong(wrong + 1);
  });

  // useEffect(() => {
  //   if (questionNum > QUEST_NUM) {
  //     setResultWords(correct > 8 ? "Отличный результат!" : correct > 5 ? "Неплохо!" : "Н-да уж...");
  //     testStarted(false);
  //     setStart(false);
  //   }
  // }, [questionNum]);

  const handleEnter = (e) => {
    if (e.key === "Enter") checkIt();
  };

  const checkIt = $(() => {
    // if (answer === question!.chinese) {
    //   setWrongAnswers([...wrongAnswers, ""]);
    //   setCorrect(correct + 1);
    //   setNewQuestion();
    // }
    // setAnswer("");
  });

  const setNewGame = $(() => {
    start.value = true;
    //   setWrongAnswers([]);
    //   setResultWords("");
    //   testStarted(true);
    //   setQuestion(null);
    //   setQuestionNum(1);
    //   setAnswer("");
    //   setCorrect(0);
    //   setWrong(0);
    //   setProgress(0);
    //   if (words) {
    //     shuffleArr(words);
    //     const newArr = words.slice(0, QUEST_NUM);
    //     setShuffledWords(newArr);
    //     setQuestion(newArr[0]);
    //   }
  });

  const gameDiv = (
    <div>
      <div class='float-right'>
        <button class='btn btn-error btn-sm' onClick$={skipQuestion}>
          Пропустить
        </button>
      </div>
      <div class='prose mb-3'>
        <h4 class='card-title'>
          Вопрос {questionNum}/{QUEST_NUM}
        </h4>
      </div>
      <p
        class=' text-sm'
        dangerouslySetInnerHTML={question ? parseRussian(question.translation, false) : ""}
      ></p>

      <div class='form-control'>
        <div class='input-group w-full '>
          <input
            type='text'
            class='input input-bordered w-full'
            placeholder='汉字'
            // onChange$={(e) => setAnswer(e.target.value)}
            value={answer}
            // onKeyDown$={handleEnter}
            autoComplete='off'
          />
          <button class='btn btn-success' type='button' onClick$={checkIt}>
            {arrorUturnDown}
          </button>
        </div>
      </div>

      {/* <label class='ms-1 mt-1'>
        <FontAwesomeIcon icon={faCheckCircle} class='text-success' /> {corrects}{" "}
        <FontAwesomeIcon icon={faTimesCircle} class='text-danger ms-2' /> {wrongs}
      </label> */}
    </div>
  );

  return (
    shuffledWords && (
      <div class='card bg-neutral w-full mb-3'>
        <div class='progress mx-1' style={{ height: "3px" }}>
          <div
            class='progress-bar bg-success'
            role='progressbar'
            style={{ width: `${100 - progress.value}%` }}
          ></div>
          <div
            class='progress-bar bg-danger'
            role='progressbar'
            style={{ width: `${progress.value}%` }}
          ></div>
        </div>

        <div class='card-body'>
          {start.value ? (
            gameDiv
          ) : (
            <div>
              <div class='prose mb-2'>
                <h3 class='card-title'>
                  {questionNum > QUEST_NUM ? (
                    "Результат"
                  ) : level ? (
                    <>
                      Успей напечатать <small>[ур. {level}]</small>
                    </>
                  ) : (
                    "Успей напечатать"
                  )}
                </h3>
              </div>
              {questionNum > QUEST_NUM && (
                <div class='row mb-3 text-center'>
                  <div class='col-sm-4'>
                    <div class='mt-2'>
                      <img
                        width={64}
                        height={64}
                        src={corrects.value > 8 ? goodImg : corrects.value < 6 ? badImg : okImg}
                        alt='your result'
                      />
                    </div>
                  </div>
                  <div class='col-sm-4'>
                    <p class=' h5'>Верно</p>
                    <p class=' h2 text-success'>
                      <strong>{corrects.value}</strong>
                    </p>
                  </div>
                  <div class='col-sm-4'>
                    <p class=' h5'>Ошибки</p>
                    <p class=' h2 text-danger'>
                      <strong>{wrongs.value}</strong>
                    </p>
                  </div>
                </div>
              )}
              {words && words.length < QUEST_NUM ? (
                <p>
                  Наберите хотя бы 10 слов в список ниже, чтобы активировать тест и проверить свои
                  знания
                </p>
              ) : (
                <div>
                  <button class='btn btn-sm btn-info mr-2' onClick$={setNewGame}>
                    {questionNum > QUEST_NUM ? "Еще раз" : "Старт"}
                  </button>
                  <span>
                    {questionNum > QUEST_NUM
                      ? `${resultWords} ${
                          wrongAnswers.filter((x) => Boolean(x)).length > 0
                            ? "Нужно повторить "
                            : ""
                        } ${wrongAnswers.filter((x) => Boolean(x)).join(", ")}`
                      : "Проверьте насколько хорошо вы знаете эти слова. Впишите нужное китайское слово за 10 сек."}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div class='flex justify-center'>
          {[...new Array(QUEST_NUM)].map((x, ind) => (
            <div
              key={ind}
              class={`badge mx-2 mb-2 ${
                wrongAnswers.length > ind
                  ? wrongAnswers[ind]
                    ? "bg-error"
                    : "bg-success"
                  : "bg-secondary"
              }`}
            >
              {" "}
            </div>
          ))}
        </div>
      </div>
    )
  );
});
