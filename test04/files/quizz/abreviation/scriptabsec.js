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
  "text": "Qu'est-ce que l'ACR ?",
  "answers": [
      {
          "text": "Arrêt cardio-respiratoire",
          "isCorrect": true,
          "comment": "L'ACR désigne effectivement l'Arrêt cardiaque, une situation critique nécessitant une intervention médicale d'urgence."
      },
      {
          "text": "Accident cérébrovasculaire rapide ",
          "isCorrect": false,
          "comment": "L'AC ne fait pas référence à un Accident cérébrovasculaire mais plutôt à un Arrêt cardiaque."
      },
      {
          "text": "Acide citrique réactif",
          "isCorrect": false,
          "comment": "AC ne représente pas Acide citrique, mais plutôt Arrêt cardiaque."
      },
      {
          "text": "Arrêt respiratoire récurrent ",
          "isCorrect": false,
          "comment": "Bien que similaire, l'AC ne signifie pas Arrêt respiratoire mais plutôt Arrêt cardiaque."
      }
  ]
},
{
  "text": "Qu'est-ce que l'ACT ?",
  "answers": [
      {
          "text": "Attelle cervico-thoracique",
          "isCorrect": true,
          "comment": "L'ACT correspond bien à l'Attelle cervico-thoracique, utilisée pour immobiliser la colonne cervicale et thoracique."
      },
      {
          "text": "Analyse chromatographique des traces",
          "isCorrect": false,
          "comment": "L'ACT ne désigne pas Analyse chromatographique des traces mais plutôt Attelle cervico-thoracique."
      },
      {
          "text": "Association des chirurgiens traumatologues",
          "isCorrect": false,
          "comment": "ACT ne représente pas Association des chirurgiens traumatologues, mais plutôt Attelle cervico-thoracique."
      },
      {
          "text": "Anticoagulant thérapeutique",
          "isCorrect": false,
          "comment": "Bien que pertinent dans certains contextes médicaux, ACT ne signifie pas Anticoagulant thérapeutique mais plutôt Attelle cervico-thoracique."
      }
  ]
},
{
  "text": "Qu'est-ce que l'AEV ?",
  "answers": [
      {
          "text": "Accident d'exposition à un risque viral",
          "isCorrect": true,
          "comment": "L'AEV fait référence à Accident d'exposition à un risque viral, une situation où une personne est exposée à un agent pathogène potentiellement infectieux."
      },
      {
          "text": "Analyse électronique des variations",
          "isCorrect": false,
          "comment": "L'AEV ne signifie pas Analyse électronique des variations mais plutôt Accident d'exposition à un risque viral."
      },
      {
          "text": "Attelle d'extension vertébrale",
          "isCorrect": false,
          "comment": "AEV ne représente pas Attelle d'extension vertébrale mais plutôt Accident d'exposition à un risque viral."
      },
      {
          "text": "Association des ergothérapeutes volontaires",
          "isCorrect": false,
          "comment": "Bien qu'une telle association puisse exister, AEV ne désigne pas Association des ergothérapeutes volontaires mais plutôt Accident d'exposition à un risque viral."
      }
  ]
},
{
  "text": "Qu'est-ce que le CO ?",
  "answers": [
      {
          "text": "Monoxyde de carbone",
          "isCorrect": true,
          "comment": "CO correspond à Monoxyde de carbone, un gaz toxique sans couleur ni odeur, souvent produit par la combustion incomplète de carburants."
      },
      {
          "text": "Charbon oxydé",
          "isCorrect": false,
          "comment": "Le CO ne représente pas Charbon oxydé, mais plutôt Monoxyde de carbone."
      },
      {
          "text": "Carbone organique",
          "isCorrect": false,
          "comment": "Bien qu'il puisse exister, CO ne signifie pas Carbone organique mais plutôt Monoxyde de carbone."
      },
      {
          "text": "Créatinine oxydase",
          "isCorrect": false,
          "comment": "Le CO ne désigne pas Créatinine oxydase, mais plutôt Monoxyde de carbone."
      }
  ]
},
{
  "text": "Qu'est-ce que le DAE ?",
  "answers": [
      {
          "text": "Défibrillateur automatisé externe",
          "isCorrect": true,
          "comment": "Le DAE correspond effectivement à Défibrillateur automatisé externe, un dispositif utilisé pour administrer un choc électrique à une personne en cas d'arrêt cardiaque."
      },
      {
          "text": "Dispositif d'assistance électrique",
          "isCorrect": false,
          "comment": "DAE ne désigne pas Dispositif d'assistance électrique mais plutôt Défibrillateur automatisé externe."
      },
      {
          "text": "Dispositif d'accès électronique",
          "isCorrect": false,
          "comment": "Bien qu'il puisse exister, DAE ne signifie pas Dispositif d'accès électronique mais plutôt Défibrillateur automatisé externe."
      },
      {
          "text": "Détecteur d'activité électrique",
          "isCorrect": false,
          "comment": "Le DAE ne représente pas Détecteur d'activité électrique, mais plutôt Défibrillateur automatisé externe."
      }
  ]
},
{
  "text": "Qu'est-ce que le DASRI ?",
  "answers": [
      {
          "text": "Déchets d'activités de soins à risques infectieux",
          "isCorrect": true,
          "comment": "Le DASRI correspond à Déchets d'activités de soins à risques infectieux, des déchets produits dans le cadre des soins médicaux et qui peuvent présenter un risque infectieux."
      },
      {
          "text": "Déchet alimentaire stérile",
          "isCorrect": false,
          "comment": "DASRI ne désigne pas Déchet alimentaire stérile mais plutôt Déchets d'activités de soins à risques infectieux."
      },
      {
          "text": "Dispositif d'aide à la réanimation",
          "isCorrect": false,
          "comment": "Bien que pertinent dans certains contextes, DASRI ne signifie pas Dispositif d'aide à la réanimation mais plutôt Déchets d'activités de soins à risques infectieux."
      },
      {
          "text": "Désinfectant antiseptique",
          "isCorrect": false,
          "comment": "Le DASRI ne représente pas Désinfectant antiseptique, mais plutôt Déchets d'activités de soins à risques infectieux."
      }
  ]
},
{
  "text": "Qu'est-ce que le DEA ?",
  "answers": [
      {
          "text": "Défibrillateur externe automatisé",
          "isCorrect": true,
          "comment": "Le DEA correspond à Défibrillateur externe automatisé, un dispositif utilisé pour administrer un choc électrique à une personne en cas d'arrêt cardiaque."
      },
      {
          "text": "Dispositif électrique autonome",
          "isCorrect": false,
          "comment": "DEA ne désigne pas Dispositif électrique autonome mais plutôt Défibrillateur externe automatisé."
      },
      {
          "text": "Direction des examens approfondis",
          "isCorrect": false,
          "comment": "Bien qu'il puisse exister, DEA ne signifie pas Direction des examens approfondis mais plutôt Défibrillateur externe automatisé."
      },
      {
          "text": "Décision d'évacuation aérienne",
          "isCorrect": false,
          "comment": "Le DEA ne représente pas Décision d'évacuation aérienne, mais plutôt Défibrillateur externe automatisé."
      }
  ]
},
{
  "text": "Qu'est-ce que le DSA ?",
  "answers": [
      {
          "text": "Défibrillateur semi-automatique",
          "isCorrect": true,
          "comment": "Le DSA correspond à Défibrillateur semi-automatique, un dispositif qui guide l'utilisateur à travers le processus de défibrillation mais nécessite une action manuelle pour administrer le choc."
      },
      {
          "text": "Dossier de santé automatisé",
          "isCorrect": false,
          "comment": "DSA ne désigne pas Dossier de santé automatisé mais plutôt Défibrillateur semi-automatique."
      },
      {
          "text": "Détecteur de signaux aériens",
          "isCorrect": false,
          "comment": "Bien qu'il puisse exister, DSA ne signifie pas Détecteur de signaux aériens mais plutôt Défibrillateur semi-automatique."
      },
      {
          "text": "Dispositif de surveillance automatique",
          "isCorrect": false,
          "comment": "Le DSA ne représente pas Dispositif de surveillance automatique, mais plutôt Défibrillateur semi-automatique."
      }
  ]
},
{
  "text": "Qu'est-ce que la FC ?",
  "answers": [
      {
          "text": "Fréquence cardiaque",
          "isCorrect": true,
          "comment": "La FC correspond bien à Fréquence cardiaque, la mesure du nombre de battements du cœur par unité de temps, généralement exprimée en battements par minute (bpm)."
      },
      {
          "text": "Force centrifuge",
          "isCorrect": false,
          "comment": "FC ne désigne pas Force centrifuge mais plutôt Fréquence cardiaque."
      },
      {
          "text": "Fièvre cérébrale",
          "isCorrect": false,
          "comment": "Bien qu'il puisse exister, FC ne signifie pas Fièvre cérébrale mais plutôt Fréquence cardiaque."
      },
      {
          "text": "Fonction cardiaque",
          "isCorrect": false,
          "comment": "La FC ne représente pas Fonction cardiaque, mais plutôt Fréquence cardiaque."
      }
  ]
},
{
  "text": "Qu'est-ce que le FFP2 ?",
  "answers": [
      {
          "text": "Masque de protection respiratoire individuel",
          "isCorrect": true,
          "comment": "Le FFP2 correspond effectivement à Masque de protection respiratoire individuel, un type de masque filtrant qui protège contre les particules en suspension dans l'air."
      },
      {
          "text": "Facteur de protection des plaies",
          "isCorrect": false,
          "comment": "FFP2 ne désigne pas Facteur de protection des plaies mais plutôt Masque de protection respiratoire individuel."
      },
      {
          "text": "Filet de fixation pour patients",
          "isCorrect": false,
          "comment": "Bien que pertinent dans certains contextes médicaux, FFP2 ne signifie pas Filet de fixation pour patients mais plutôt Masque de protection respiratoire individuel."
      },
      {
          "text": "Feuille de fixation pour pansements",
          "isCorrect": false,
          "comment": "Le FFP2 ne représente pas Feuille de fixation pour pansements, mais plutôt Masque de protection respiratoire individuel."
      }
  ]
},
{
  "questions": [
      {
          "text": "Qu'est-ce que le FR ?",
          "answers": [
              {
                  "text": "Fréquence respiratoire",
                  "isCorrect": true,
                  "comment": "Réponse correcte."
              },
              {
                  "text": "Fréquence cardiaque",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Fréquence rénale",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Fréquence régulatrice",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              }
          ]
      },
      {
          "text": "Qu'est-ce que le MID ?",
          "answers": [
              {
                  "text": "Matelas immobilisateur à dépression",
                  "isCorrect": true,
                  "comment": "Réponse correcte."
              },
              {
                  "text": "Maladie infectieuse déclarée",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Mesure d'indice de dépression",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Méthode d'immobilisation dynamique",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              }
          ]
      },
      {
          "text": "Qu'est-ce que la PA ?",
          "answers": [
              {
                  "text": "Pression artérielle",
                  "isCorrect": true,
                  "comment": "Réponse correcte."
              },
              {
                  "text": "Pression atmosphérique",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Pression abdominale",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Pression aéroportée",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              }
          ]
      },
      {
          "text": "Qu'est-ce que la SpO2 ?",
          "answers": [
              {
                  "text": "Saturation pulsée en oxygène",
                  "isCorrect": true,
                  "comment": "Réponse correcte."
              },
              {
                  "text": "Spécialisation des oxygènes",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Sécurité des opérations à oxygène",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Surveillance de l'oxygénation du sang",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              }
          ]
      },
      {
          "text": "Qu'est-ce que le RCP ?",
          "answers": [
              {
                  "text": "Réanimation cardio-pulmonaire",
                  "isCorrect": true,
                  "comment": "Réponse correcte."
              },
              {
                  "text": "Révision des conduites premières",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Réparation chirurgicale pulmonaire",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Réseau de communication pulmonaire",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              }
          ]
      },
      {
          "text": "Qu'est-ce que la TA ?",
          "answers": [
              {
                  "text": "Tension artérielle",
                  "isCorrect": true,
                  "comment": "Réponse correcte."
              },
              {
                  "text": "Tachycardie articulaire",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Traction abdominale",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Tension atmosphérique",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              }
          ]
      },
      {
          "text": "Qu'est-ce que le VHB ?",
          "answers": [
              {
                  "text": "Virus de l'hépatite B",
                  "isCorrect": true,
                  "comment": "Réponse correcte."
              },
              {
                  "text": "Vaccin pour hépatite B",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Vaccin du virus du VHB",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Vaccin d'immunité hépatique",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              }
          ]
      },
      {
          "text": "Qu'est-ce que le VHC ?",
          "answers": [
              {
                  "text": "Virus de l'hépatite C",
                  "isCorrect": true,
                  "comment": "Réponse correcte."
              },
              {
                  "text": "Virus du VHC",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Vaccin contre le VHC",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Variété du virus de l'hépatite C",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              }
          ]
      },
      {
          "text": "Qu'est-ce que le VIH ?",
          "answers": [
              {
                  "text": "Virus de l'immunodéficience humaine",
                  "isCorrect": true,
                  "comment": "Réponse correcte."
              },
              {
                  "text": "Vaccin de l'immunité humaine",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Vaccin contre le VIH",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Variété du virus de l'immunodéficience humaine",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              }
          ]
      },
      {
          "text": "Qu'est-ce que l'O2 ?",
          "answers": [
              {
                  "text": "Oxygène",
                  "isCorrect": true,
                  "comment": "Réponse correcte."
              },
              {
                  "text": "Osmose opérationnelle",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Organisation des opérations",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Ordonnancement oxygéné",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              }
          ]
      },
      {
          "text": "Qu'est-ce que le CO2 ?",
          "answers": [
              {
                  "text": "Dioxyde de carbone",
                  "isCorrect": true,
                  "comment": "Réponse correcte."
              },
              {
                  "text": "Communication oxygénée",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Contre-ordre 2",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Carbonate de dioxyde",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              }
          ]
      },
      {
          "text": "Qu'est-ce que l'OVA ?",
          "answers": [
              {
                  "text": "Obstruction des voies aériennes",
                  "isCorrect": true,
                  "comment": "Réponse correcte."
              },
              {
                  "text": "Organisation des voies aériennes",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Obstruction des voies alvéolaires",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Organisation des voies alvéolaires",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              }
          ]
      },
      {
          "text": "Qu'est-ce que les VA ?",
          "answers": [
              {
                  "text": "Voies aériennes",
                  "isCorrect": true,
                  "comment": "Réponse correcte."
              },
              {
                  "text": "Voies artérielles",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Voies atmosphériques",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Voies acides",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              }
          ]
      },
      {
          "text": "Qu'est-ce que la PLS ?",
          "answers": [
              {
                  "text": "Position latérale de sécurité",
                  "isCorrect": true,
                  "comment": "Réponse correcte."
              },
              {
                  "text": "Position de libération sécurisée",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Position de liaison sécurisée",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Position lombaire stabilisée",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              }
          ]
      },
      {
          "text": "Qu'est-ce que l'AVC ?",
          "answers": [
              {
                  "text": "Accident vasculaire cérébral",
                  "isCorrect": true,
                  "comment": "Réponse correcte."
              },
              {
                  "text": "Arrêt vasculaire cardiaque",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Accident vasculaire corporel",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Arrêt vasculaire cérébro-spinal",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              }
          ]
      },
      {
          "text": "Qu'est-ce que la CUMP ?",
          "answers": [
              {
                  "text": "Cellule d'urgence médico-psychologique",
                  "isCorrect": true,
                  "comment": "Réponse correcte."
              },
              {
                  "text": "Cellule médicale d'urgence multi-professionnelle",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Cellule d'urgence médicale et paramédicale",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Cellule médicale d'urgence mobile et psychologique",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              }
          ]
      },
      {
          "text": "Qu'est-ce que la MIN ?",
          "answers": [
              {
                  "text": "Mort inattendue et inexpliquée du nourrisson",
                  "isCorrect": true,
                  "comment": "Réponse correcte."
              },
              {
                  "text": "Maladie infantile négligée",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Malformation infantile neuromusculaire",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Mécanisme d'isolement néonatal",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              }
          ]
      },
      {
          "text": "Qu'est-ce que le Hg ?",
          "answers": [
              {
                  "text": "Mercure",
                  "isCorrect": true,
                  "comment": "Réponse correcte."
              },
              {
                  "text": "Humidité globale",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Hydrogène gazeux",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Hémoglobine glycolysée",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              }
          ]
      },
      {
          "text": "Qu'est-ce que la LVA ?",
          "answers": [
              {
                  "text": "Libération des voies aériennes",
                  "isCorrect": true,
                  "comment": "Réponse correcte."
              },
              {
                  "text": "Lutte contre les voies aériennes",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Luminosité visuelle ambiante",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Langue verte aiguë",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              }
          ]
      },
      {
          "text": "Qu'est-ce que la SAI ?",
          "answers": [
              {
                  "text": "Seringue auto-injectable",
                  "isCorrect": true,
                  "comment": "Réponse correcte."
              },
              {
                  "text": "Seringue autonome intégrée",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Système d'autorégulation immédiate",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Seringue automatique injectable",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              }
          ]
      },
      {
          "text": "Qu'est-ce que la DGSCGC ?",
          "answers": [
              {
                  "text": "Direction Générale de la Sécurité Civile et de la Gestion des crises",
                  "isCorrect": true,
                  "comment": "Réponse correcte."
              },
              {
                  "text": "Direction Générale de la Surveillance Civile et de la Gestion des catastrophes",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Direction Générale de la Santé et de la Sécurité des Crises Générales",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              },
              {
                  "text": "Direction Générale de la Sécurité et de la Gestion des Crises Civiles",
                  "isCorrect": false,
                  "comment": "Ce n'est pas la bonne réponse."
              }
          ]
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
