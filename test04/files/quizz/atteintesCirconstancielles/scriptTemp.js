//
// lib/lib.js
//
var Question = function (questionObj) {
  this.value = {
    text: "Question",
    answers: []
  };

  this.selectedAnswer = null;
  this.html = null;
  this.questionText = null;
  this.questionAnswers = null;
  this.questionFeedback = null;

  this.value = Object.assign(this.value, questionObj);

  this.onQuestionAnswered = ({ detail }) => {
    this.selectedAnswer = {
      value: detail.answer,
      html: detail.answerHtml
    };
    this.update();
  
    let feedbackText;
    if (detail.answer.isCorrect) {
      feedbackText = "Correct! ";
    } else {
      feedbackText = "Incorrect. ";
    }
    feedbackText += detail.answer.comment; // Ajouter le commentaire à la réponse
  
    this.questionFeedback.innerHTML = feedbackText;
  
    document.dispatchEvent(
      new CustomEvent("question-answered", {
        detail: {
          question: this,
          answer: detail.answer
        }
      })
    );
  };
  

  this.create = function () {
    this.html = document.createElement("div");
    this.html.classList.add("question");

    this.questionText = document.createElement("div");
    this.questionText.classList.add("titreQuestion");
    this.questionText.textContent = this.value.text;

    this.questionAnswers = document.createElement("div");
    this.questionAnswers.classList.add("answers");

    for (let i = 0; i < this.value.answers.length; i++) {
      const ansObj = this.value.answers[i];
      let answer = createAnswer(ansObj);

      answer.onclick = (ev) => {
        if (this.selectedAnswer !== null) {
          this.selectedAnswer.html.classList.remove("selected");
        }

        answer.classList.add("selected");

        this.html.dispatchEvent(
          new CustomEvent("question-answered", {
            detail: {
              answer: ansObj,
              answerHtml: answer
            }
          })
        );
      };

      this.questionAnswers.appendChild(answer);
    }

    this.questionFeedback = document.createElement("div");
    this.questionFeedback.classList.add("question-feedback");

    this.html.appendChild(this.questionText);
    this.html.appendChild(this.questionAnswers);
    this.html.appendChild(this.questionFeedback);

    this.html.addEventListener("question-answered", this.onQuestionAnswered);

    return this.html;
  };

  this.disable = function () {
    this.html.classList.add("disabled");
    this.html.onclick = (ev) => {
      ev.stopPropagation();
    };

    this.html.removeEventListener("question-answered", this.onQuestionAnswered);

    let answers = this.html.querySelectorAll(".answer");
    for (let i = 0; i < answers.length; i++) {
      let answer = answers[i];
      answer.onclick = null;
    }
  };

  this.remove = function () {
    let children = this.html.querySelectorAll("*");
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      this.html.removeChild(child);
    }

    this.html.removeEventListener("question-answered", this.onQuestionAnswered);

    this.html.parentNode.removeChild(this.html);
    this.html = null;
  };

  this.update = function () {
    let correctFeedback, incorrectFeedback;
    this.html = this.html || document.createElement("div");

    correctFeedback = "Exact !";
    incorrectFeedback = "Non.";

    if (this.selectedAnswer !== null) {
      if (this.selectedAnswer.value.isCorrect) {
        this.html.classList.add("correct");
        this.html.classList.remove("incorrect");
        this.questionFeedback.innerHTML = correctFeedback;
      } else {
        this.html.classList.add("incorrect");
        this.html.classList.remove("correct");
        this.questionFeedback.innerHTML = incorrectFeedback;
      }
    }
  };

  function createAnswer(obj) {
    this.value = {
      text: "Answer",
      isCorrect: false
    };

    this.value = Object.assign(this.value, obj);

    this.html = document.createElement("button");
    this.html.classList.add("answer");

    this.html.textContent = this.value.text;

    return this.html;
  }
};

//
// main.js
//

let questionsData = [
  {
    text: "Quelle est la définition des gelures ?",
    answers: [
        {
            text: "Des brûlures causées par l'exposition prolongée au soleil.",
            isCorrect: false, comment: "Incorrect. Les gelures ne sont pas causées par l'exposition prolongée au soleil, mais par un refroidissement intense."
        },
        {
            text: "Des lésions cutanées et des tissus sous-jacents provoquées par un refroidissement intense.",
            isCorrect: true,
            comment: "Correct. Les gelures sont des lésions cutanées et des tissus sous-jacents provoquées par un refroidissement intense."
        },
        {
            text: "Des éruptions cutanées dues à une allergie alimentaire.",
            isCorrect: false,
            comment: "Incorrect. Les gelures ne sont pas des éruptions cutanées dues à une allergie alimentaire."
        },
        {
            text: "Des plaies causées par des frottements répétés.",
            isCorrect: false,
            comment: "Incorrect. Les gelures ne sont pas des plaies causées par des frottements répétés, mais par un refroidissement intense."
        }
    ]
},{
      text: "Quelles sont les parties du corps les plus susceptibles d'être touchées par des gelures ?",
      answers: [
          {
              text: "Le dos et les bras.",
              isCorrect: false,
              comment: "Incorrect. Les parties les plus susceptibles d'être touchées par des gelures sont les pieds, les mains et le visage."
          },
          {
              text: "Les genoux et les coudes.",
              isCorrect: false,
              comment: "Incorrect. Les parties les plus susceptibles d'être touchées par des gelures sont les pieds, les mains et le visage."
          },
          {
              text: "Les pieds, les mains et le visage.",
              isCorrect: true,
              comment: "Correct. Les parties les plus susceptibles d'être touchées par des gelures sont les pieds, les mains et le visage."
          },
          {
              text: "Le cou et le torse.",
              isCorrect: false,
              comment: "Incorrect. Les parties les plus susceptibles d'être touchées par des gelures sont les pieds, les mains et le visage, pas le cou et le torse."
          }
      ]
  },
  {
      text: "Quelles sont les activités qui peuvent augmenter le risque de gelures ?",
      answers: [
          {
              text: "La natation.",
              isCorrect: false,
              comment: "Incorrect. La natation n'augmente pas le risque de gelures, car elle se pratique généralement dans des environnements où la température est contrôlée."
          },
          {
              text: "La randonnée en montagne.",
              isCorrect: true,
              comment: "Correct. La randonnée en montagne peut augmenter le risque de gelures en raison des températures froides et des conditions météorologiques extrêmes."
          },
          {
              text: "Le yoga.",
              isCorrect: false,
              comment: "Incorrect. Le yoga n'augmente pas le risque de gelures, car il est généralement pratiqué à l'intérieur dans des environnements contrôlés."
          },
          {
              text: "La lecture à l'intérieur.",
              isCorrect: false,
              comment: "Incorrect. La lecture à l'intérieur ne présente pas de risque de gelures, car elle se fait généralement dans des environnements chauffés."
          }
      ]
  },
  {
      text: "Comment la vasoconstriction contribue-t-elle aux gelures ?",
      answers: [
          {
              text: "Elle dilate les vaisseaux sanguins pour augmenter le flux sanguin vers les extrémités.",
              isCorrect: false,
              comment: "Incorrect. La vasoconstriction contracte les vaisseaux sanguins, diminuant ainsi le flux sanguin vers les extrémités, ce qui contribue aux gelures."
          },
          {
              text: "Elle contracte les vaisseaux sanguins, diminuant ainsi le flux sanguin vers les extrémités.",
              isCorrect: true,
              comment: "Correct. La vasoconstriction contracte les vaisseaux sanguins, diminuant ainsi le flux sanguin vers les extrémités, ce qui contribue aux gelures."
          },
          {
              text: "Elle réchauffe les tissus en générant de la chaleur interne.",
              isCorrect: false,
              comment: "Incorrect. La vasoconstriction n'est pas responsable du réchauffement des tissus, mais de la conservation de la chaleur corporelle."
          },
          {
              text: "Elle provoque des démangeaisons et des irritations cutanées.",
              isCorrect: false,
              comment: "Incorrect. La vasoconstriction ne provoque pas de démangeaisons et d'irritations cutanées, mais contribue à la réduction du flux sanguin vers les extrémités."
          }
      ]
  },
  {
      text: "Quels facteurs peuvent augmenter le risque de gelures ?",
      answers: [
          {
              text: "L'alimentation saine et équilibrée.",
              isCorrect: false,
              comment: "Incorrect. Une alimentation saine et équilibrée ne contribue pas au risque de gelures, mais peut aider à maintenir une santé générale."
          },
          {
              text: "L'hydratation adéquate.",
              isCorrect: false,
              comment: "Incorrect. Une hydratation adéquate ne contribue pas au risque de gelures, mais est importante pour la santé générale."
          },
          {
              text: "La consommation d'alcool et de tabac.",
              isCorrect: true,
              comment: "Correct. La consommation d'alcool et de tabac peut augmenter le risque de gelures en raison de leurs effets sur la circulation sanguine et la sensibilité au froid."
          },
          {
              text: "L'exercice physique régulier.",
              isCorrect: false,
              comment: "Incorrect. L'exercice physique régulier n'augmente pas le risque de gelures, mais est bénéfique pour la santé cardiovasculaire."
          }
      ]
  },
  {
      text: "Quels sont les différents stades de gravité des gelures ?",
      answers: [
          {
              text: "2 stades.",
              isCorrect: false,
              comment: "Incorrect. Les gelures ont généralement 4 stades de gravité."
          },
          {
              text: "3 stades.",
              isCorrect: false,
              comment: "Incorrect. Les gelures ont généralement 4 stades de gravité."
          },
          {
              text: "4 stades.",
              isCorrect: true,
              comment: "Correct. Les gelures ont généralement 4 stades de gravité, allant de légers à graves."
          },
          {
              text: "5 stades.",
              isCorrect: false,
              comment: "Incorrect. Les gelures ont généralement 4 stades de gravité, pas 5."
          }
      ]
  },
  {
      text: "Quel est le premier regard important lors de l'examen d'une victime de gelures ?",
      answers: [
          {
              text: "Rechercher des signes d'hypothermie.",
              isCorrect: false,
              comment: "Incorrect. Bien que la recherche de signes d'hypothermie soit importante, l'examen des mains et des pieds pour toute rougeur est le premier regard essentiel lors de l'examen d'une victime de gelures."
          },
          {
              text: "Examiner les mains et les pieds pour toute rougeur.",
              isCorrect: true,
              comment: "Correct. L'examen des mains et des pieds pour toute rougeur est le premier regard important lors de l'examen d'une victime de gelures, car cela peut indiquer la présence de gelures."
          },
          {
              text: "Poser des questions sur la durée d'exposition au froid.",
              isCorrect: false,
              comment: "Incorrect. Bien que poser des questions sur la durée d'exposition au froid puisse être utile, l'examen des mains et des pieds pour toute rougeur est le premier regard essentiel lors de l'examen d'une victime de gelures."
          },
          {
              text: "Demander si la victime a des antécédents de maladies vasculaires.",
              isCorrect: false,
              comment: "Incorrect. Bien que la connaissance des antécédents médicaux de la victime soit importante, l'examen des mains et des pieds pour toute rougeur est le premier regard essentiel lors de l'examen d'une victime de gelures."
          }
      ]
  },
  {
      text: "Quelle est la première mesure recommandée pour traiter une gelure ?",
      answers: [
          {
              text: "Réchauffer immédiatement la zone atteinte avec de l'eau chaude.",
              isCorrect: false,
              comment: "Incorrect. La première mesure recommandée pour traiter une gelure est d'isoler la victime dans un endroit chaud et à l'abri du vent."
          },
          {
              text: "Appliquer de la glace sur la zone touchée.",
              isCorrect: false,
              comment: "Incorrect. L'application de glace n'est pas recommandée pour traiter une gelure, car cela peut aggraver les lésions cutanées."
          },
          {
              text: "Isoler la victime dans un endroit chaud et à l'abri du vent.",
              isCorrect: true,
              comment: "Correct. La première mesure recommandée pour traiter une gelure est d'isoler la victime dans un endroit chaud et à l'abri du vent pour éviter une exposition supplémentaire au froid."
          },
          {
              text: "Masser doucement la zone affectée.",
              isCorrect: false,
              comment: "Incorrect. Le massage doux de la zone affectée n'est pas recommandé car il peut aggraver les lésions cutanées."
          }
      ]
  },
  {
      text: "Quelle est la meilleure façon de réchauffer les extrémités touchées par des gelures ?",
      answers: [
          {
              text: "Les frotter vigoureusement avec les mains.",
              isCorrect: false,
              comment: "Incorrect. Frotter vigoureusement les extrémités touchées peut aggraver les lésions et causer des dommages supplémentaires."
          },
          {
              text: "Les placer contre la peau du sauveteur.",
              isCorrect: true,
              comment: "Correct. Placer les extrémités touchées contre la peau du sauveteur est une méthode efficace pour réchauffer progressivement la zone affectée."
          },
          {
              text: "Les immerger dans de l'eau chaude.",
              isCorrect: false,
              comment: "Incorrect. L'immersion dans de l'eau chaude peut provoquer des brûlures, surtout si la température de l'eau est trop élevée."
          },
          {
              text: "Les exposer à un radiateur.",
              isCorrect: false,
              comment: "Incorrect. Exposer les extrémités touchées à un radiateur peut provoquer des brûlures et n'est pas recommandé."
          }
      ]
  },
  {
      text: "Pourquoi est-il important de ne pas toucher aux cloques formées par une gelure ?",
      answers: [
          {
              text: "Pour éviter une infection.",
              isCorrect: true,
              comment: "Correct. Il est important de ne pas toucher aux cloques formées par une gelure pour éviter une infection et pour permettre à la peau de guérir correctement."
          },
          {
              text: "Pour accélérer le processus de guérison.",
              isCorrect: false,
              comment: "Incorrect. Toucher les cloques formées par une gelure peut en fait aggraver les lésions et retarder le processus de guérison."
          },
          {
              text: "Pour réduire la douleur.",
              isCorrect: false,
              comment: "Incorrect. Toucher les cloques formées par une gelure peut en fait aggraver les lésions et augmenter la douleur."
          },
          {
              text: "Pour permettre à la peau de se reconstruire correctement.",
              isCorrect: false,
              comment: "Incorrect. Toucher les cloques formées par une gelure peut en fait aggraver les lésions et entraver le processus de reconstruction de la peau."
          }
      ]
  },
  {
      text: "Quelle est la meilleure température pour réchauffer les gelures sévères ?",
      answers: [
          {
              text: "Entre 10°C et 15°C.",
              isCorrect: false,
              comment: "Incorrect. Les gelures sévères doivent être réchauffées à une température plus élevée pour éviter l'hypothermie et permettre une récupération efficace."
          },
          {
              text: "Entre 20°C et 25°C.",
              isCorrect: false,
              comment: "Incorrect. Les gelures sévères doivent être réchauffées à une température plus élevée pour éviter l'hypothermie et permettre une récupération efficace."
          },
          {
              text: "Entre 30°C et 35°C.",
              isCorrect: false,
              comment: "Incorrect. Les gelures sévères doivent être réchauffées à une température plus élevée pour éviter l'hypothermie et permettre une récupération efficace."
          },
          {
              text: "Entre 37°C et 39°C.",
              isCorrect: true,
              comment: "Correct. Les gelures sévères doivent être réchauffées à une température entre 37°C et 39°C pour éviter l'hypothermie et permettre une récupération efficace."
          }
      ]
  },
  {
      text: "Quelle est la recommandation concernant l'application de chaleur sèche sur une gelure ?",
      answers: [
          {
              text: "C'est recommandé pour accélérer le processus de guérison.",
              isCorrect: false,
              comment: "Incorrect. L'application de chaleur sèche sur une gelure peut aggraver les lésions et n'est pas recommandée."
          },
          {
              text: "C'est sans danger si la température ne dépasse pas 40°C.",
              isCorrect: false,
              comment: "Incorrect. Même à des températures inférieures à 40°C, l'application de chaleur sèche peut aggraver les lésions des gelures."
          },
          {
              text: "Cela peut aggraver les lésions et causer des brûlures.",
              isCorrect: true,
              comment: "Correct. L'application de chaleur sèche sur une gelure peut aggraver les lésions et causer des brûlures, ce qui n'est pas recommandé."
          },
          {
              text: "Cela aide à réduire la douleur.",
              isCorrect: false,
              comment: "Incorrect. L'application de chaleur sèche peut aggraver les lésions et n'est pas recommandée pour réduire la douleur associée aux gelures."
          }
      ]
  },
  {
      text: "Que doit-on faire après avoir réchauffé une gelure sévère ?",
      answers: [
          {
              text: "Appliquer une crème hydratante.",
              isCorrect: false,
              comment: "Incorrect. Après avoir réchauffé une gelure sévère, il est recommandé de recouvrir les lésions d'un pansement stérile et de consulter un professionnel de santé pour un traitement approprié."
          },
          {
              text: "Couvrir la zone avec un bandage serré.",
              isCorrect: false,
              comment: "Incorrect. Couvrir la zone avec un bandage serré peut aggraver les lésions et n'est pas recommandé."
          },
          {
              text: "Masser doucement la zone affectée.",
              isCorrect: false,
              comment: "Incorrect. Masser doucement la zone affectée peut aggraver les lésions et n'est pas recommandé."
          },
          {
              text: "Recouvrir les lésions d'un pansement stérile et consulter un professionnel de santé.",
              isCorrect: true,
              comment: "Correct. Après avoir réchauffé une gelure sévère, il est recommandé de recouvrir les lésions d'un pansement stérile et de consulter un professionnel de santé pour un traitement approprié."
          }
      ]
  },
  {
      text: "Pourquoi est-il important de ne pas réchauffer une gelure si une réexposition au froid est possible ?",
      answers: [
          {
              text: "Parce que cela peut causer des brûlures.",
              isCorrect: false,
              comment: "Incorrect. Ne pas réchauffer une gelure en cas de réexposition au froid est important pour éviter d'aggraver les lésions, mais cela ne concerne pas spécifiquement le risque de brûlures."
          },
          {
              text: "Parce que cela peut aggraver les lésions.",
              isCorrect: true,
              comment: "Correct. Ne pas réchauffer une gelure en cas de réexposition au froid est important pour éviter d'aggraver les lésions cutanées et tissulaires."
          },
          {
              text: "Parce que cela peut provoquer une réaction allergique.",
              isCorrect: false,
              comment: "Incorrect. Le risque de réaction allergique n'est pas la principale raison pour laquelle il est important de ne pas réchauffer une gelure en cas de réexposition au froid."
          },
          {
              text: "Parce que cela peut entraîner une augmentation de la pression artérielle.",
              isCorrect: false,
              comment: "Incorrect. Le risque d'augmentation de la pression artérielle n'est pas la principale raison pour laquelle il est important de ne pas réchauffer une gelure en cas de réexposition au froid."
          }
      ]
  },
  {
      text: "Quel est l'objectif principal de l'action de secours pour les gelures ?",
      answers: [
          {
              text: "Réchauffer rapidement les parties touchées.",
              isCorrect: false,
              comment: "Incorrect. L'objectif principal de l'action de secours pour les gelures est de demander un avis médical pour un traitement approprié."
          },
          {
              text: "Prévenir l'hypothermie.",
              isCorrect: false,
              comment: "Incorrect. Bien que la prévention de l'hypothermie soit importante, l'objectif principal de l'action de secours pour les gelures est de demander un avis médical pour un traitement approprié."
          },
          {
              text: "Demander un avis médical.",
              isCorrect: true,
              comment: "Correct. L'objectif principal de l'action de secours pour les gelures est de demander un avis médical pour un traitement approprié afin de prévenir les complications et de favoriser une guérison rapide."
          },
          {
              text: "Isoler la victime dans un endroit chaud.",
              isCorrect: false,
              comment: "Incorrect. Isoler la victime dans un endroit chaud est une mesure importante, mais l'objectif principal de l'action de secours pour les gelures est de demander un avis médical pour un traitement approprié."
          }
      ]
  },
  {
      text: "Quelle est la définition des gelures ?",
      answers: [
          {
              text: "Des brûlures causées par l'exposition prolongée au soleil.",
              isCorrect: false,
              comment: "Incorrect. Les gelures sont des lésions cutanées et des tissus sous-jacents provoquées par un refroidissement intense."
          },
          {
              text: "Des lésions cutanées et des tissus sous-jacents provoquées par un refroidissement intense.",
              isCorrect: true,
              comment: "Correct. Les gelures sont des lésions cutanées et des tissus sous-jacents provoquées par un refroidissement intense."
          },
          {
              text: "Des éruptions cutanées dues à une allergie alimentaire.",
              isCorrect: false,
              comment: "Incorrect. Les gelures ne sont pas des éruptions cutanées dues à une allergie alimentaire."
          },
          {
              text: "Des plaies causées par des frottements répétés.",
              isCorrect: false,
              comment: "Incorrect. Les gelures ne sont pas des plaies causées par des frottements répétés."
          }
      ]
  },
  {
      text: "Quelles sont les parties du corps les plus susceptibles d'être touchées par des gelures ?",
      answers: [
          {
              text: "Le dos et les bras.",
              isCorrect: false,
              comment: "Incorrect. Les parties les plus susceptibles d'être touchées par des gelures sont les pieds, les mains et le visage."
          },
          {
              text: "Les genoux et les coudes.",
              isCorrect: false,
              comment: "Incorrect. Les parties les plus susceptibles d'être touchées par des gelures sont les pieds, les mains et le visage."
          },
          {
              text: "Les pieds, les mains et le visage.",
              isCorrect: true,
              comment: "Correct. Les parties les plus susceptibles d'être touchées par des gelures sont les pieds, les mains et le visage."
          },
          {
              text: "Le cou et le torse.",
              isCorrect: false,
              comment: "Incorrect. Les parties les plus susceptibles d'être touchées par des gelures sont les pieds, les mains et le visage."
          }
      ]
  },
  {
      text: "Quelles sont les activités qui peuvent augmenter le risque de gelures ?",
      answers: [
          {
              text: "La natation.",
              isCorrect: false,
              comment: "Incorrect. La natation n'est généralement pas associée à un risque de gelures."
          },
          {
              text: "La randonnée en montagne.",
              isCorrect: true,
              comment: "Correct. La randonnée en montagne expose souvent les individus à des conditions climatiques extrêmes propices aux gelures."
          },
          {
              text: "Le yoga.",
              isCorrect: false,
              comment: "Incorrect. Le yoga n'est généralement pas associé à un risque de gelures."
          },
          {
              text: "La lecture à l'intérieur.",
              isCorrect: false,
              comment: "Incorrect. La lecture à l'intérieur ne présente pas de risque de gelures."
          }
      ]
  },
  {
      text: "Comment la vasoconstriction contribue-t-elle aux gelures ?",
      answers: [
          {
              text: "Elle dilate les vaisseaux sanguins pour augmenter le flux sanguin vers les extrémités.",
              isCorrect: false,
              comment: "Incorrect. La vasoconstriction contracte les vaisseaux sanguins, diminuant ainsi le flux sanguin vers les extrémités et contribuant aux gelures."
          },
          {
              text: "Elle contracte les vaisseaux sanguins, diminuant ainsi le flux sanguin vers les extrémités.",
              isCorrect: true,
              comment: "Correct. La vasoconstriction contracte les vaisseaux sanguins, diminuant ainsi le flux sanguin vers les extrémités et contribuant aux gelures."
          },
          {
              text: "Elle réchauffe les tissus en générant de la chaleur interne.",
              isCorrect: false,
              comment: "Incorrect. La vasoconstriction ne réchauffe pas les tissus en générant de la chaleur interne."
          },
          {
              text: "Elle provoque des démangeaisons et des irritations cutanées.",
              isCorrect: false,
              comment: "Incorrect. La vasoconstriction ne provoque pas des démangeaisons et des irritations cutanées, mais elle peut causer des engourdissements et des picotements."
          }
      ]
  },
  {
      text: "Quels facteurs peuvent augmenter le risque de gelures ?",
      answers: [
          {
              text: "La pratique régulière d'exercices physiques.",
              isCorrect: false,
              comment: "Incorrect. La pratique régulière d'exercices physiques n'augmente généralement pas le risque de gelures."
          },
          {
              text: "La consommation excessive d'aliments gras.",
              isCorrect: false,
              comment: "Incorrect. La consommation excessive d'aliments gras n'augmente généralement pas le risque de gelures."
          },
          {
              text: "La transpiration excessive.",
              isCorrect: false,
              comment: "Incorrect. La transpiration excessive peut causer des problèmes de refroidissement, mais elle n'est pas directement associée au risque de gelures."
          },
          {
              text: "La prise d'alcool et de drogues.",
              isCorrect: true,
              comment: "Correct. La prise d'alcool et de drogues peut augmenter le risque de gelures en altérant la perception de la température et en réduisant la capacité du corps à réguler sa température."
          }
      ]
  },
  {
      text: "Quel est le principal risque associé à l'hypothermie ?",
      answers: [
          {
              text: "Le réchauffement excessif du corps.",
              isCorrect: false,
              comment: "Incorrect. Le principal risque associé à l'hypothermie est le ralentissement des fonctions vitales pouvant aller jusqu'à leur interruption."
          },
          {
              text: "La déshydratation.",
              isCorrect: false,
              comment: "Incorrect. La déshydratation n'est pas le principal risque associé à l'hypothermie."
          },
          {
              text: "Le ralentissement des fonctions vitales pouvant aller jusqu'à leur interruption.",
              isCorrect: true,
              comment: "Correct. Le principal risque associé à l'hypothermie est le ralentissement des fonctions vitales pouvant aller jusqu'à leur interruption."
          },
          {
              text: "L'augmentation du métabolisme.",
              isCorrect: false,
              comment: "Incorrect. L'hypothermie entraîne généralement une diminution du métabolisme, pas une augmentation."
          }
      ]
  },
  {
      text: "À quelle température corporelle considère-t-on qu'une hypothermie est légère ?",
      answers: [
          {
              text: "32 à 28°C",
              isCorrect: false,
              comment: "Incorrect. Cette plage de température correspond à une hypothermie modérée ou sévère."
          },
          {
              text: "35 à 32°C",
              isCorrect: true,
              comment: "Correct. Une température corporelle comprise entre 35 et 32°C est généralement considérée comme une hypothermie légère."
          },
          {
              text: "28 à 24°C",
              isCorrect: false,
              comment: "Incorrect. Cette plage de température correspond à une hypothermie sévère."
          },
          {
              text: "35 à 30°C",
              isCorrect: false,
              comment: "Incorrect. Cette plage de température est également considérée comme une hypothermie légère."
          }
      ]
  },
  {
      text: "Quels sont les signes associés à une hypothermie modérée ?",
      answers: [
          {
              text: "Frissons permanents et peau froide.",
              isCorrect: false,
              comment: "Incorrect. Ces symptômes sont associés à une hypothermie légère."
          },
          {
              text: "Délire, hallucinations et troubles de la conscience.",
              isCorrect: true,
              comment: "Correct. Le délire, les hallucinations et les troubles de la conscience sont des signes associés à une hypothermie modérée."
          },
          {
              text: "Perte de connaissance et arrêt cardiaque.",
              isCorrect: false,
              comment: "Incorrect. Ces symptômes sont généralement associés à une hypothermie sévère."
          },
          {
              text: "Ventilation et fréquence cardiaque rapides.",
              isCorrect: false,
              comment: "Incorrect. Ces symptômes sont généralement associés à une hypothermie légère."
          }
      ]
  },
  {
      text: "Comment peut-on évaluer la température d'une victime d'hypothermie sur les lieux ?",
      answers: [
          {
              text: "En utilisant un thermomètre standard.",
              isCorrect: false,
              comment: "Incorrect. Il peut être difficile d'évaluer précisément la température centrale d'une victime d'hypothermie sur les lieux à l'aide d'un thermomètre standard."
          },
          {
              text: "En mesurant la température de l'air ambiant.",
              isCorrect: false,
              comment: "Incorrect. La température de l'air ambiant peut ne pas refléter avec précision la température corporelle d'une victime d'hypothermie."
          },
          {
              text: "En corrélant les signes présentés par la victime avec sa température centrale.",
              isCorrect: true,
              comment: "Correct. L'évaluation de la température d'une victime d'hypothermie sur les lieux est souvent basée sur une évaluation des signes cliniques associés à l'hypothermie et peut être corrélée avec sa température centrale."
          },
          {
              text: "En utilisant un thermomètre oral.",
              isCorrect: false,
              comment: "Incorrect. Les thermomètres oraux peuvent ne pas être précis pour évaluer la température corporelle des victimes d'hypothermie sur les lieux."
          }
      ]
  },
  {
      text: "Quelle est la première étape de l'action de secours pour une victime d'hypothermie ?",
      answers: [
          {
              text: "Demander un avis médical.",
              isCorrect: false,
              comment: "Incorrect. Isoler la victime dans un endroit chaud est généralement la première étape de l'action de secours pour une victime d'hypothermie."
          },
          {
              text: "Réchauffer immédiatement la victime.",
              isCorrect: false,
              comment: "Incorrect. Isoler la victime dans un endroit chaud est généralement la première étape de l'action de secours pour une victime d'hypothermie."
          },
          {
              text: "Isoler la victime dans un endroit chaud.",
              isCorrect: true,
              comment: "Correct. Isoler la victime dans un endroit chaud est généralement la première étape de l'action de secours pour une victime d'hypothermie."
          },
          {
              text: "Évaluer la température de la victime.",
              isCorrect: false,
              comment: "Incorrect. Isoler la victime dans un endroit chaud est généralement la première étape de l'action de secours pour une victime d'hypothermie."
          }
      ]
  },
  {
      text: "Quelle est la température de réchauffement recommandée pour une victime d'hypothermie modérée ou sévère ?",
      answers: [
          {
              text: "30 à 35°C",
              isCorrect: false,
              comment: "Incorrect. La température de réchauffement recommandée pour une victime d'hypothermie modérée ou sévère est de 37 à 39°C."
          },
          {
              text: "37 à 39°C",
              isCorrect: true,
              comment: "Correct. La température de réchauffement recommandée pour une victime d'hypothermie modérée ou sévère est de 37 à 39°C."
          },
          {
              text: "25 à 30°C",
              isCorrect: false,
              comment: "Incorrect. Cette plage de température est trop basse pour réchauffer efficacement une victime d'hypothermie modérée ou sévère."
          },
          {
              text: "20 à 25°C",
              isCorrect: false,
              comment: "Incorrect. Cette plage de température est trop basse pour réchauffer efficacement une victime d'hypothermie modérée ou sévère."
          }
      ]
  },
  {
      text: "Quelles sont les précautions particulières à prendre lors de la réanimation cardio-pulmonaire (RCP) d'une victime d'hypothermie ?",
      answers: [
          {
              text: "Réaliser la RCP aussi rapidement que possible.",
              isCorrect: false,
              comment: "Incorrect. Il est important de prendre des précautions particulières lors de la RCP d'une victime d'hypothermie, notamment en limitant le nombre de défibrillations chez une victime dont la température est inférieure à 30°C."
          },
          {
              text: "Ne pas confirmer l'hypothermie en mesurant la température de la victime.",
              isCorrect: false,
              comment: "Incorrect. Il est important de confirmer l'hypothermie chez une victime avant de commencer la réanimation cardio-pulmonaire (RCP)."
          },
          {
              text: "Limiter le nombre de défibrillations chez une victime dont la température est inférieure à 30°C.",
              isCorrect: true,
              comment: "Correct. Il est recommandé de limiter le nombre de défibrillations chez une victime d'hypothermie, car le cœur hypotherme peut ne pas réagir de manière appropriée à la défibrillation."
          },
          {
              text: "Ne pas réaliser de RCP tant que la température de la victime n'a pas été mesurée.",
              isCorrect: false,
              comment: "Incorrect. La réanimation cardio-pulmonaire (RCP) doit être initiée immédiatement chez une victime en arrêt cardiaque, indépendamment de sa température corporelle."
          }
      ]
  },
  {
      text: "Quelle est la première mesure à prendre si une victime a perdu connaissance mais respire lentement ?",
      answers: [
          {
              text: "Réchauffer immédiatement la victime.",
              isCorrect: false,
              comment: "Incorrect. Si une victime a perdu connaissance mais respire lentement, la première mesure à prendre est de réaliser la réanimation cardio-pulmonaire (RCP)."
          },
          {
              text: "Réaliser la RCP.",
              isCorrect: true,
              comment: "Correct. Si une victime a perdu connaissance mais respire lentement, la première mesure à prendre est de réaliser la réanimation cardio-pulmonaire (RCP)."
          },
          {
              text: "Demander un avis médical.",
              isCorrect: false,
              comment: "Incorrect. Si une victime a perdu connaissance mais respire lentement, la première mesure à prendre est de réaliser la réanimation cardio-pulmonaire (RCP)."
          },
          {
              text: "Isoler la victime dans un endroit chaud.",
              isCorrect: false,
              comment: "Incorrect. Isoler la victime dans un endroit chaud est important pour prévenir l'hypothermie, mais ce n'est pas la première mesure à prendre dans ce cas."
          }
      ]
  },
  {
      text: "Comment devrait-on mobiliser une victime d'hypothermie modérée ou sévère ?",
      answers: [
          {
              text: "Rapidement et brusquement pour éviter qu'elle se refroidisse davantage.",
              isCorrect: false,
              comment: "Incorrect. Les victimes d'hypothermie modérée ou sévère doivent être mobilisées avec précaution et sans à-coups pour éviter d'aggraver leurs blessures et leur hypothermie."
          },
          {
              text: "Avec précaution et sans à-coups.",
              isCorrect: true,
              comment: "Correct. Les victimes d'hypothermie modérée ou sévère doivent être mobilisées avec précaution et sans à-coups pour éviter d'aggraver leurs blessures et leur hypothermie."
          },
          {
              text: "En utilisant des mouvements vigoureux pour stimuler la circulation sanguine.",
              isCorrect: false,
              comment: "Incorrect. Les mouvements vigoureux peuvent aggraver les lésions tissulaires chez une victime d'hypothermie et doivent être évités."
          },
          {
              text: "En les maintenant immobiles jusqu'à l'arrivée des secours.",
              isCorrect: false,
              comment: "Incorrect. Il est important de mobiliser les victimes d'hypothermie modérée ou sévère pour éviter les complications liées à l'immobilisation prolongée, mais cela doit être fait avec précaution."
          }
      ]
  },
  {
      text: "Quelle est la température d'un bain chaud recommandé pour réchauffer une victime d'hypothermie ?",
      answers: [
          {
              text: "40 à 45°C",
              isCorrect: false,
              comment: "Incorrect. Un bain trop chaud peut causer des brûlures chez une victime d'hypothermie et doit être évité."
          },
          {
              text: "37 à 39°C",
              isCorrect: true,
              comment: "Correct. Un bain dont la température est comprise entre 37 et 39°C est recommandé pour réchauffer une victime d'hypothermie."
          },
          {
              text: "30 à 35°C",
              isCorrect: false,
              comment: "Incorrect. Un bain dont la température est comprise entre 30 et 35°C peut ne pas être suffisamment chaud pour réchauffer efficacement une victime d'hypothermie."
          },
          {
              text: "Moins de 30°C",
              isCorrect: false,
              comment: "Incorrect. Un bain dont la température est inférieure à 30°C peut ne pas être suffisamment chaud pour réchauffer efficacement une victime d'hypothermie."
          }
      ]
  },
  {
      text: "Quelle est la meilleure méthode pour réchauffer des mains gelées ?",
      answers: [
          {
              text: "Les frotter vigoureusement avec un tissu sec.",
              isCorrect: false,
              comment: "Incorrect. Frotter vigoureusement les mains gelées peut aggraver les lésions tissulaires et doit être évité."
          },
          {
              text: "Les placer sous l'eau chaude.",
              isCorrect: true,
              comment: "Correct. Placer les mains gelées sous l'eau chaude est une méthode efficace pour les réchauffer en toute sécurité."
          },
          {
              text: "Les exposer à une source de chaleur directe, comme un radiateur.",
              isCorrect: false,
              comment: "Incorrect. Exposer les mains gelées à une source de chaleur directe peut causer des brûlures et doit être évité."
          },
          {
              text: "Les envelopper dans des vêtements épais.",
              isCorrect: false,
              comment: "Incorrect. Bien que l'enveloppement des mains dans des vêtements épais puisse aider à retenir la chaleur, cela peut ne pas être suffisant pour réchauffer des mains déjà gelées."
          }
      ]
  },
  {
      text: "Quelle est la première étape de l'action de secours pour les gelures ?",
      answers: [
          {
              text: "Réchauffer rapidement les parties touchées.",
              isCorrect: false,
              comment: "Incorrect. L'objectif principal de l'action de secours pour les gelures est de demander un avis médical pour un traitement approprié."
          },
          {
              text: "Prévenir l'hypothermie.",
              isCorrect: false,
              comment: "Incorrect. Bien que la prévention de l'hypothermie soit importante, l'objectif principal de l'action de secours pour les gelures est de demander un avis médical pour un traitement approprié."
          },
          {
              text: "Demander un avis médical.",
              isCorrect: true,
              comment: "Correct. L'objectif principal de l'action de secours pour les gelures est de demander un avis médical pour un traitement approprié afin de prévenir les complications et de favoriser une guérison rapide."
          },
          {
              text: "Isoler la victime dans un endroit chaud.",
              isCorrect: false,
              comment: "Incorrect. Isoler la victime dans un endroit chaud est une mesure importante, mais l'objectif principal de l'action de secours pour les gelures est de demander un avis médical pour un traitement approprié."
          }
      ]
  },
  {
  text: "Quelle est la température corporelle normale d'un être humain à l'état normal ?",
  answers : [
      {
          text: "32°C",
          isCorrect: false,
          comment: "Incorrect. La température corporelle normale d'un être humain à l'état normal est généralement d'environ 37°C."
      },
      {
          text: "35°C",
          isCorrect: false,
          comment: "Incorrect. La température corporelle normale d'un être humain à l'état normal est généralement d'environ 37°C."
      },
      {
          text: "37°C",
          isCorrect: true,
          comment: "Correct. La température corporelle normale d'un être humain à l'état normal est généralement d'environ 37°C."
      },
      {
          text: "40°C",
          isCorrect: false,
          comment: "Incorrect. Une température corporelle de 40°C serait considérée comme élevée et peut indiquer de la fièvre."
      }
  ]
},
{
  text: "Quel est le principal risque associé à l'hypothermie ?",
  answers: [
      {
          text: "Le réchauffement excessif du corps",
          isCorrect: false,
          comment: "Incorrect. Le principal risque associé à l'hypothermie est le ralentissement des fonctions vitales pouvant aller jusqu'à leur interruption."
      },
      {
          text: "La déshydratation",
          isCorrect: false,
          comment: "Incorrect. Bien que la déshydratation soit un risque potentiel dans certaines situations, le principal risque associé à l'hypothermie est le ralentissement des fonctions vitales pouvant aller jusqu'à leur interruption."
      },
      {
          text: "Le ralentissement des fonctions vitales pouvant aller jusqu'à leur interruption",
          isCorrect: true,
          comment: "Correct. Le principal risque associé à l'hypothermie est le ralentissement des fonctions vitales pouvant aller jusqu'à leur interruption, ce qui peut entraîner des complications graves, voire la mort."
      },
      {
          text: "L'augmentation du métabolisme",
          isCorrect: false,
          comment: "Incorrect. L'hypothermie est généralement associée à un ralentissement du métabolisme plutôt qu'à une augmentation."
      }
  ]
}
];


// variables initialization
let questions = [];
let score = 0,
  answeredQuestions = 0;
let appContainer = document.getElementById("questions-container");
let scoreContainer = document.getElementById("score-container");
scoreContainer.innerHTML = `Score: ${score}/${5}`;

/**
 * Shuffles array in place. ES6 version
 * @param {Array} arr items An array containing the items.
 */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

shuffle(questionsData);

// creating questions
for (var i = 0; i < 5; i++) {
  let question = new Question({
    text: questionsData[i].text,
    answers: questionsData[i].answers
  });

  appContainer.appendChild(question.create());
  questions.push(question);
}

document.addEventListener("question-answered", ({ detail }) => {
  if (detail.answer.isCorrect) {
    score++;
  }

  answeredQuestions++;
  scoreContainer.innerHTML = `Score: ${score}/${questions.length}`;
  detail.question.disable();

  if (answeredQuestions == questions.length) {
    setTimeout(function () {
      alert(`Quiz completed! \nFinal score: ${score}/${questions.length}`);
    }, 100);
  }
});

console.log(questions, questionsData);
