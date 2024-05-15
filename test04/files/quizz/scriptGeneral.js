
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
        "text": "Quel est l'objectif principal de l'abord relationnel ?",
        "answers": [
            {
                text: "Fournir un traitement médical immédiat",
                isCorrect: false,
                comment: "L'objectif principal est d'établir un contact et un dialogue."
            },
            {
                text: "Établir un contact et un dialogue",
                isCorrect: true,
                comment: "L'abord relationnel vise à établir un contact et un dialogue avec la victime."
            },
            {
                text: "Identifier les responsabilités légales",
                isCorrect: false,
                comment: "Bien que cela soit important, ce n'est pas l'objectif principal de l'abord relationnel."
            },
            {
                text: "Ignorer les émotions de la victime",
                isCorrect: false,
                comment: "L'abord relationnel implique de reconnaître et de prendre en compte les émotions de la victime."
            }
        ]
      },
      {
        "text": "Comment devrait-on aborder la victime lors d'une intervention ?",
        "answers": [
            {
                text: "En évitant tout contact direct",
                isCorrect: false,
                comment: "Un contact direct est souvent nécessaire pour établir une relation de confiance."
            },
            {
                text: "En changeant fréquemment d'interlocuteur",
                isCorrect: false,
                comment: "Cela peut induire de la confusion chez la victime. Un interlocuteur principal est préférable."
            },
            {
                text: "En privilégiant un interlocuteur principal et en s'identifiant",
                isCorrect: true,
                comment: "Cela permet d'établir une communication claire et de construire une relation de confiance."
            },
            {
                text: "En ignorant les signes d'émotion de la victime",
                isCorrect: false,
                comment: "Il est important de reconnaître et de prendre en compte les émotions de la victime."
            }
        ]
      },
      {
        "text": "Pourquoi est-il important de prendre le temps de se présenter à la victime ?",
        "answers": [
            {
                text: "Pour laisser la victime dans l'incertitude",
                isCorrect: false,
                comment: "Cela peut augmenter l'anxiété de la victime. La clarté est préférable."
            },
            {
                text: "Pour établir un rapport de confiance",
                isCorrect: true,
                comment: "Se présenter permet d'établir un rapport de confiance et de réduire l'anxiété de la victime."
            },
            {
                text: "Pour accélérer l'intervention médicale",
                isCorrect: false,
                comment: "Bien que l'intervention rapide soit importante, la confiance est également essentielle."
            },
            {
                text: "Pour minimiser l'importance de la situation",
                isCorrect: false,
                comment: "Minimiser la situation peut invalider les émotions de la victime."
            }
        ]
      },
      
      
      
      {
        "text": "Quelle question est recommandée pour instaurer le dialogue avec la victime ?",
        "answers": [
            {
                text: "Avez-vous besoin d'une assistance médicale immédiate?",
                isCorrect: false,
                comment: "Cette question peut être trop directe et ne pas encourager le dialogue."
            },
            {
                text: "Quel est votre nom?",
                isCorrect: false,
                comment: "Cette question peut sembler superficielle au début de l'intervention."
            },
            {
                text: "Pouvez-vous me dire ce qu'il se passe?",
                isCorrect: true,
                comment: "Cette question encourage la victime à partager son expérience et à ouvrir le dialogue."
            },
            {
                text: "Pourquoi êtes-vous ici?",
                isCorrect: false,
                comment: "Cette question peut être perçue comme accusatrice ou jugementale."
            }
        ]
      },
      {
        "text": "Quelle est l'étape suivante après avoir posé le cadre de l'intervention ?",
        "answers": [
            {
                text: "Transporter immédiatement la victime à l'hôpital",
                isCorrect: false,
                comment: "Informer et expliquer ce qui va être réalisé est souvent la prochaine étape."
            },
            {
                text: "Explorer les loisirs de la victime",
                isCorrect: false,
                comment: "Cela peut sembler inapproprié ou déplacé dans ce contexte."
            },
            {
                text: "Informer et expliquer ce qui va être réalisé",
                isCorrect: true,
                comment: "Cette étape permet à la victime de comprendre le processus et de se sentir en contrôle."
            },
            {
                text: "Demander à la victime de quitter les lieux",
                isCorrect: false,
                comment: "Cela peut être précipité et ne pas répondre aux besoins de la victime."
            }
        ]
      },
      {
        "text": "Pourquoi est-il important de reformuler ce que la victime a exprimé ?",
        "answers": [
            {
                text: "Pour laisser la victime dans la confusion",
                isCorrect: false,
                comment: "Cela peut augmenter l'anxiété de la victime. La clarification est préférable."
            },
            {
                text: "Pour vérifier la compréhension et montrer de l'empathie",
                isCorrect: true,
                comment: "Reformuler montre à la victime qu'elle est entendue et comprise, ce qui renforce la relation."
            },
            {
                text: "Pour minimiser l'importance de ses propos",
                isCorrect: false,
                comment: "Cela peut invalider les émotions de la victime et nuire à la relation."
            },
            {
                text: "Pour éviter toute communication supplémentaire",
                isCorrect: false,
                comment: "La communication supplémentaire peut être nécessaire pour clarifier les informations."
            }
        ]
      },
      {
        "text": "Comment peut-on favoriser la relation avec la victime ?",
        "answers": [
            {
                text: "En lui demandant de quitter les lieux",
                isCorrect: false,
                comment: "Cela peut être perçu comme insensible et ne répond pas aux besoins de la victime."
            },
            {
                text: "En ignorant ses besoins et préférences",
                isCorrect: false,
                comment: "Cela peut compromettre la relation et la confiance de la victime envers les soignants."
            },
            {
                text: "En impliquant la victime dans sa propre prise en charge",
                isCorrect: true,
                comment: "Impliquer la victime dans les décisions concernant son propre soin renforce son autonomie et son empowerment."
            },
            {
                text: "En faisant des promesses impossibles à tenir",
                isCorrect: false,
                comment: "Cela peut créer de la frustration et de la méfiance chez la victime."
            }
        ]
      },
      {
        "text": "Quelle est l'étape finale avant de passer le relais à une autre équipe ?",
        "answers": [
            {
                text: "Ignorer la victime et partir",
                isCorrect: false,
                comment: "Cela va à l'encontre du principe de fournir un soutien et un suivi appropriés."
            },
            {
                text: "Préparer le passage de relais",
                isCorrect: true,
                comment: "Préparer le passage de relais assure une transition fluide et un suivi adéquat de la victime."
            },
            {
                text: "Rester avec la victime indéfiniment",
                isCorrect: false,
                comment: "Cela peut être inapproprié et ne répond pas toujours aux besoins de la victime."
            },
            {
                text: "Refuser toute aide supplémentaire",
                isCorrect: false,
                comment: "Cela va à l'encontre du principe de fournir un soutien complet à la victime."
            }
        ]
      },
      {
        "text": "Comment devrait-on saluer la victime à la fin de l'intervention ?",
        "answers": [
            {
                text: "En lui souhaitant une bonne continuation et en prenant congé",
                isCorrect: true,
                comment: "Saluer la victime de manière respectueuse et chaleureuse aide à conclure l'interaction de manière positive."
            },
            {
                text: "En lui demandant de ne pas contacter d'autres personnes pour obtenir du soutien",
                isCorrect: false,
                comment: "Cela peut limiter les ressources de soutien de la victime et ne pas respecter son autonomie."
            },
            {
                text: "En lui rappelant les détails de l'intervention",
                isCorrect: false,
                comment: "Cela peut sembler intrusif et ne pas aider à la fin de l'interaction."
            },
            {
                text: "En minimisant l'impact de la situation sur sa vie",
                isCorrect: false,
                comment: "Cela peut invalider les émotions de la victime et ne pas reconnaître son vécu."
            }
        ]
      },
      {
        "text": "Quel est le ton général recommandé lors de l'interaction avec la victime ?",
        "answers": [
            {
                text: "Froid et distancié",
                isCorrect: false,
                comment: "Cela peut créer une barrière entre le soignant et la victime, compromettant la relation."
            },
            {
                text: "Calme et rassurant",
                isCorrect: true,
                comment: "Un ton calme et rassurant peut aider à apaiser la victime et à établir une relation de confiance."
            },
            {
                text: "Pressé et impatient",
                isCorrect: false,
                comment: "Cela peut augmenter l'anxiété de la victime et compromettre la qualité de l'interaction."
            },
            {
                text: "Critique et blâmant",
                isCorrect: false,
                comment: "Cela peut nuire à l'estime de soi de la victime et ne pas favoriser un environnement de soutien."
            }
        ]
      },
      {
        "text": "Quelles sont les deux catégories de victimes parmi les enfants dans une situation de secours ?",
        "answers": [
            {
                text: "Victime primaire et victime secondaire",
                isCorrect: true,
                comment: "Ces deux catégories décrivent les enfants directement affectés par la situation d'urgence et ceux indirectement touchés."
            },
            {
                text: "Victime tertiaire et victime quaternaire",
                isCorrect: false,
                comment: "Ces catégories décrivent généralement les personnes touchées par les conséquences à plus long terme d'une urgence."
            },
            {
                text: "Victime principale et victime accessoire",
                isCorrect: false,
                comment: "Ces termes ne sont pas couramment utilisés pour décrire les catégories de victimes chez les enfants lors d'une intervention d'urgence."
            },
            {
                text: "Victime prioritaire et victime secondaire",
                isCorrect: false,
                comment: "Ces termes ne sont pas utilisés pour décrire les catégories de victimes chez les enfants lors d'une intervention d'urgence."
            }
        ]
      },
      
      {
        "text": "Comment devrait-on adapter sa communication lorsqu'on intervient auprès d'un enfant ?",
        "answers": [
            {
                text: "En utilisant un ton froid et distant",
                isCorrect: false,
                comment: "Un ton froid et distant peut intimider l'enfant et rendre la communication moins efficace."
            },
            {
                text: "En parlant uniquement avec des mots compliqués",
                isCorrect: false,
                comment: "L'utilisation de mots compliqués peut rendre la communication confuse pour l'enfant, il est préférable d'utiliser un langage simple et adapté à son âge."
            },
            {
                text: "En s'adressant directement à l'enfant et en utilisant des mots simples et honnêtes",
                isCorrect: true,
                comment: "C'est la meilleure approche pour établir une communication efficace avec un enfant pendant une intervention."
            },
            {
                text: "En évitant tout contact visuel avec l'enfant",
                isCorrect: false,
                comment: "Le contact visuel est important pour établir une connexion émotionnelle avec l'enfant, il ne devrait pas être évité."
            }
        ]
      },
      
      {
        "text": "Que devrait éviter de faire le secouriste tout au long de l'intervention auprès de l'enfant ?",
        "answers": [
            {
                text: "Dire la vérité sur la gravité de la situation",
                isCorrect: false,
                comment: "La transparence est importante pour établir la confiance avec l'enfant, donc mentir ne devrait jamais être une option."
            },
            {
                text: "Obliger l'enfant à parler",
                isCorrect: false,
                comment: "Forcer l'enfant à parler peut augmenter son stress et rendre l'interaction plus difficile, il est préférable de lui permettre de s'exprimer à son propre rythme."
            },
            {
                text: "Banaliser ou dramatiser la situation",
                isCorrect: true,
                comment: "Banaliser la situation peut minimiser les sentiments de l'enfant, tandis que dramatiser peut aggraver son anxiété, il est important de maintenir un équilibre et de fournir un soutien approprié."
            },
            {
                text: "Encourager les attitudes héroïques",
                isCorrect: false,
                comment: "Encourager les attitudes héroïques peut mettre trop de pression sur l'enfant et aggraver son stress, il est préférable de fournir un soutien et un réconfort."
            }
        ]
      },
      {
        "text": "Quelle attitude le secouriste devrait-il adopter envers les émotions de l'enfant ?",
        "answers": [
            {
                text: "Les ignorer complètement",
                isCorrect: false,
                comment: "Ignorer les émotions de l'enfant peut lui faire sentir qu'il n'est pas écouté ou compris, ce qui peut aggraver son stress."
            },
            {
                text: "Encourager les attitudes héroïques",
                isCorrect: false,
                comment: "Encourager les attitudes héroïques peut mettre trop de pression sur l'enfant et l'empêcher d'exprimer ses véritables émotions."
            },
            {
                text: "Accepter ses réactions normales et l'autoriser à exprimer ses émotions",
                isCorrect: true,
                comment: "C'est important pour aider l'enfant à se sentir compris et soutenu pendant une situation stressante."
            },
            {
                text: "Menacer de quitter la situation",
                isCorrect: false,
                comment: "Menacer de quitter la situation peut aggraver l'anxiété de l'enfant et lui faire sentir qu'il est abandonné, ce qui n'est pas approprié."
            }
        ]
      },
      {
        "text": "Pourquoi est-il important de ne pas mentir à l'enfant pendant l'intervention ?",
        "answers": [
            {
                text: "Pour éviter de le perturber davantage",
                isCorrect: true,
                comment: "La transparence est importante pour établir la confiance avec l'enfant et minimiser son anxiété."
            },
            {
                text: "Pour minimiser l'importance de la situation",
                isCorrect: false,
                comment: "Minimiser la situation peut faire sentir à l'enfant que ses sentiments ne sont pas pris au sérieux, ce qui peut aggraver son stress."
            },
            {
                text: "Pour faire preuve d'autorité",
                isCorrect: false,
                comment: "La confiance et le soutien sont plus importants que l'autorité dans ce contexte, donc mentir ne devrait pas être utilisé comme un moyen de montrer l'autorité."
            },
            {
                text: "Pour impressionner les parents",
                isCorrect: false,
                comment: "L'objectif principal devrait être le bien-être de l'enfant, pas l'impression des parents, donc mentir ne devrait jamais être une option."
            }
        ]
      },
      
      {
        text: "Quels sont les risques psychologiques principaux auxquels est exposé le secouriste dans son activité ?",
        answers: [
            {
                text: "Fatigue physique et sentiment de déshumanisation",
                isCorrect: false,
                comment: "Bien que la fatigue physique puisse être un risque, le principal risque est lié au stress, au traumatisme, à l'usure et à l'épuisement."
            },
            {
                text: "Troubles du sommeil et dépression",
                isCorrect: false,
                comment: "Bien que ces problèmes puissent survenir, ils ne couvrent pas tous les risques psychologiques auxquels est exposé un secouriste."
            },
            {
                text: "Stress, traumatisme, usure et épuisement",
                isCorrect: true,
                comment: "Ces risques sont souvent associés aux activités de secours en raison de la nature des situations auxquelles les secouristes sont confrontés."
            },
            {
                text: "Sentiment d'accomplissement personnel et motivation",
                isCorrect: false,
                comment: "Bien que le sentiment d'accomplissement puisse être une partie de l'expérience, il ne couvre pas tous les risques psychologiques."
            }
        ]
      },
      {
        text: "Quelle est la réaction immédiate de stress qui permet au secouriste de mobiliser ses ressources pour accomplir sa mission ?",
        answers: [
            {
                text: "Fuite",
                isCorrect: false,
                comment: "La fuite n'est pas une réaction de stress productive pour un secouriste, elle peut compromettre sa capacité à accomplir sa mission."
            },
            {
                text: "Action automatique",
                isCorrect: false,
                comment: "Bien que l'action automatique puisse se produire, ce n'est pas la réaction immédiate de stress qui permet au secouriste de mobiliser ses ressources."
            },
            {
                text: "Sidération",
                isCorrect: false,
                comment: "La sidération peut paralyser le secouriste, ce qui compromettrait sa capacité à agir efficacement en situation d'urgence."
            },
            {
                text: "Focalisation d'attention",
                isCorrect: true,
                comment: "La focalisation de l'attention permet au secouriste de se concentrer sur la tâche à accomplir malgré le stress, ce qui est essentiel pour une intervention réussie."
            }
        ]
      },
      {
        text: "Quels sont les symptômes principaux d'un trouble de stress aigu chez un secouriste ?",
        answers: [
            {
                text: "Répétition de l'événement initial et évitement des situations similaires",
                isCorrect: false,
                comment: "Ces symptômes sont plus associés au trouble de stress post-traumatique (TSPT) qu'au trouble de stress aigu."
            },
            {
                text: "Conduites d'hypervigilance et pensées négatives",
                isCorrect: false,
                comment: "Bien que ces symptômes puissent se produire, ils ne sont pas spécifiques au trouble de stress aigu."
            },
            {
                text: "Flashbacks et réactions de sidération",
                isCorrect: true,
                comment: "Ces symptômes sont caractéristiques du trouble de stress aigu, qui survient dans les jours ou les semaines suivant un événement traumatique."
            },
            {
                text: "Sentiment d'accomplissement personnel et adaptation à la situation",
                isCorrect: false,
                comment: "Le sentiment d'accomplissement personnel et l'adaptation ne sont pas des symptômes d'un trouble de stress aigu, mais plutôt des aspects positifs de l'expérience professionnelle."
            }
        ]
      },
      {
        text: "Qu'est-ce que le traumatisme vicariant ?",
        answers: [
            {
                text: "Un trouble psychologique développé par les victimes",
                isCorrect: false,
                comment: "Le traumatisme vicariant n'est pas développé par les victimes, mais par les professionnels qui sont exposés aux traumatismes des autres."
            },
            {
                text: "Une forme de traumatisme direct vécu par le secouriste",
                isCorrect: false,
                comment: "Le traumatisme vicariant est une forme de traumatisme indirect qui résulte de l'exposition aux traumatismes des autres, pas du vécu direct du secouriste."
            },
            {
                text: "Une conviction d'un monde dangereux développée par le secouriste",
                isCorrect: true,
                comment: "Le traumatisme vicariant peut conduire le secouriste à développer une vision du monde comme étant intrinsèquement dangereux ou menaçant."
            },
            {
                text: "Un symptôme de stress aigu chez le secouriste",
                isCorrect: false,
                comment: "Le traumatisme vicariant est distinct du stress aigu, bien qu'ils puissent être liés dans certaines situations."
            }
        ]
      },
      {
        text: "Quels sont les symptômes d'un épuisement professionnel (burn-out) chez le secouriste ?",
        answers: [
            {
                text: "Épuisement émotionnel, déshumanisation et sentiment de non-accomplissement personnel",
                isCorrect: true,
                comment: "Ces symptômes sont caractéristiques de l'épuisement professionnel, qui résulte d'un stress chronique lié au travail."
            },
            {
                text: "Insensibilité aux émotions, cynisme et vision positive des autres",
                isCorrect: false,
                comment: "Ces symptômes sont associés au cynisme, mais pas nécessairement à l'épuisement professionnel."
            },
            {
                text: "Perte d'estime de soi, manque de ressources émotionnelles et engagement professionnel",
                isCorrect: false,
                comment: "Ces symptômes peuvent être associés à l'épuisement professionnel, mais ils ne le définissent pas entièrement."
            },
            {
                text: "Perte d'idéal du métier et sentiment d'échec",
                isCorrect: false,
                comment: "Ces symptômes peuvent être présents dans l'épuisement professionnel, mais ils ne sont pas les seuls ni les plus spécifiques."
            }
        ]
      },
      
      {
        text: "Quelle est l'une des compétences indissociables pour être efficace en tant que secouriste ?",
        answers: [
            {
                text: "Connaissance approfondie des protocoles médicaux",
                isCorrect: false,
                comment: "La connaissance des protocoles médicaux est importante, mais elle n'est pas indissociable pour être efficace en tant que secouriste."
            },
            {
                text: "Condition physique optimale",
                isCorrect: true,
                comment: "Une bonne condition physique est essentielle pour répondre efficacement aux situations d'urgence et pour assurer sa propre sécurité."
            },
            {
                text: "SST",
                isCorrect: false,
                comment: "La capacité à prendre des décisions rapides est importante, mais elle peut être compromise en l'absence d'une condition physique optimale."
            },
            {
                text: "Sensibilité émotionnelle",
                isCorrect: false,
                comment: "La sensibilité émotionnelle peut être utile dans certaines situations, mais elle n'est pas indissociable pour être efficace en tant que secouriste."
            }
        ]
      },
      {
        text: "Quelles sont les mesures recommandées pour préserver l'opérationnalité mentale du secouriste ?",
        answers: [
            {
                text: "Éviter les situations stressantes et émotionnelles",
                isCorrect: false,
                comment: "Éviter les situations stressantes et émotionnelles peut être difficile voire impossible dans le cadre des activités de secours."
            },
            {
                text: "Suivre un régime alimentaire strict et équilibré",
                isCorrect: false,
                comment: "Un régime alimentaire équilibré est important pour la santé, mais il ne suffit pas à préserver l'opérationnalité mentale du secouriste."
            },
            {
                text: "Appliquer des techniques de gestion du stress et soigner son hygiène de vie",
                isCorrect: true,
                comment: "La gestion du stress et une bonne hygiène de vie sont essentielles pour préserver l'opérationnalité mentale du secouriste face aux défis professionnels."
            },
            {
                text: "Se concentrer uniquement sur les aspects techniques de la mission",
                isCorrect: false,
                comment: "Se concentrer uniquement sur les aspects techniques peut négliger les aspects émotionnels et relationnels des interventions, ce qui peut compromettre l'efficacité du secouriste."
            }
        ]
      },
      {
        text: "Que devrait faire le secouriste si l'un des membres de l'équipe présente des signes inhabituelles pendant une intervention?",
        answers: [
            {
                text: "Ignorer les signes et poursuivre la mission",
                isCorrect: false,
                comment: "Ignorer les signes de détresse d'un membre de l'équipe peut aggraver la situation et compromettre la sécurité de tous les membres."
            },
            {
                text: "Informer le chef d'équipe pour ajuster la mission",
                isCorrect: true,
                comment: "Il est important de signaler tout signe de détresse ou de manifestations inhabituelles à la hiérarchie afin d'adapter la mission en conséquence et de fournir un soutien approprié."
            },
            {
                text: "Blâmer le membre de l'équipe pour son comportement",
                isCorrect: false,
                comment: "Blâmer un membre de l'équipe pour des manifestations inhabituelles peut aggraver sa détresse et compromettre le fonctionnement de l'équipe."
            },
            {
                text: "Demander à l'équipe de se disperser et de se reposer",
                isCorrect: false,
                comment: "Demander à l'équipe de se disperser peut compromettre la coordination et l'efficacité de l'intervention, surtout si des manifestations inhabituelles surviennent chez plusieurs membres de l'équipe."
            }
        ]
      },
      {
        text: "Qu'est-ce qui peut nécessiter une orientation vers une aide professionnelle spécialisée pour un secouriste ?",
        answers: [
            {
                text: "Une réaction immédiate de stress",
                isCorrect: false,
                comment: "Une réaction immédiate de stress est normale dans certaines situations et ne nécessite pas nécessairement une aide professionnelle spécialisée à moins qu'elle ne persiste ou s'aggrave."
            },
            {
                text: "Une diminution des capacités de réflexe",
                isCorrect: false,
                comment: "Une diminution des capacités de réflexe peut être un signe de fatigue ou de stress, mais cela ne nécessite pas nécessairement une aide professionnelle spécialisée à moins que cela n'interfère avec la capacité de travailler efficacement."
            },
            {
                text: "Un sentiment d'accomplissement personnel",
                isCorrect: false,
                comment: "Un sentiment d'accomplissement personnel est positif et ne nécessite pas une orientation vers une aide professionnelle spécialisée."
            },
            {
                text: "Des signes de souffrance psychologique",
                isCorrect: true,
                comment: "Des signes de souffrance psychologique tels que des symptômes de stress prolongés, des troubles du sommeil ou des difficultés relationnelles peuvent nécessiter une orientation vers une aide professionnelle spécialisée pour aider le secouriste à faire face à ces défis."
            }
        ]
      },
      {
        text: "Quel est l'objectif de l'appui psychologique précoce et approprié pour un secouriste ?",
        answers: [
            {
                text: "Améliorer ses performances physiques",
                isCorrect: false,
                comment: "L'appui psychologique n'est pas principalement axé sur l'amélioration des performances physiques, mais sur la gestion du stress et la prévention des troubles psychologiques."
            },
            {
                text: "Faciliter sa récupération sur les plans personnels et professionnels",
                isCorrect: true,
                comment: "L'objectif de l'appui psychologique précoce et approprié est de soutenir le secouriste dans sa récupération physique et émotionnelle après des situations stressantes, afin de préserver sa santé mentale et son bien-être général."
            },
            {
                text: "Minimiser son engagement émotionnel dans les interventions",
                isCorrect: false,
                comment: "L'appui psychologique ne vise pas à minimiser l'engagement émotionnel, mais à aider le secouriste à gérer efficacement ses réactions émotionnelles dans le cadre de son travail."
            },
            {
                text: "Favoriser une vision optimiste de son métier",
                isCorrect: false,
                comment: "L'appui psychologique peut aider le secouriste à maintenir une perspective réaliste sur son métier et à développer des stratégies pour faire face aux défis professionnels, mais il ne vise pas nécessairement à favoriser une vision optimiste à tout prix."
            }
        ]
      }, {
        "text": "Comment peut-on évaluer la douleur chez un enfant ?",
        "answers": [
            {
                text: "En lui posant des questions complexes sur ses sensations",
                isCorrect: false,
                comment: "Les questions complexes peuvent être difficiles à comprendre pour un enfant et peuvent ne pas donner une évaluation précise de sa douleur."
            },
            {
                text: "En se basant uniquement sur ses pleurs",
                isCorrect: false,
                comment: "Les pleurs peuvent être un indicateur de douleur, mais ils ne sont pas toujours fiables car certains enfants peuvent ne pas pleurer même s'ils ressentent de la douleur."
            },
            {
                text: "En utilisant des échelles d'auto-évaluation adaptées à son âge",
                isCorrect: true,
                comment: "Les échelles d'auto-évaluation sont souvent utilisées pour évaluer la douleur chez les enfants, en leur demandant de choisir un visage ou une expression qui correspond à ce qu'ils ressentent."
            },
            {
                text: "En lui donnant des médicaments sans poser de questions",
                isCorrect: false,
                comment: "Administrer des médicaments sans évaluation appropriée de la douleur peut être dangereux et ne devrait pas être fait sans supervision médicale."
            }
        ]
      },
      {
        "text": "Pourquoi l'utilisation d'une peluche est-elle recommandée lors de l'intervention auprès d'un enfant ?",
        "answers": [
            {
                text: "Pour distraire l'enfant et le faire rire",
                isCorrect: false,
                comment: "Bien que la distraction soit un aspect de l'utilisation de la peluche, ce n'est pas sa seule raison d'être recommandée."
            },
            {
                text: "Pour remplacer la présence des parents",
                isCorrect: false,
                comment: "La peluche ne peut pas remplacer la présence des parents, mais elle peut offrir un soutien émotionnel supplémentaire à l'enfant pendant une situation stressante."
            },
            {
                text: "Pour faciliter la prise de contact et créer un lien avec l'enfant",
                isCorrect: true,
                comment: "La peluche peut être utilisée pour établir une relation de confiance avec l'enfant et rendre l'interaction plus confortable."
            },
            {
                text: "Pour effrayer davantage l'enfant",
                isCorrect: false,
                comment: "L'intention de l'intervention est de réconforter l'enfant, non de l'effrayer davantage, donc la peluche ne devrait pas être utilisée dans ce but."
            }
        ]
      },
      
      {
        "text": "Pourquoi est-il important de prendre en compte les signes de détresse psychologique chez une victime selon le texte ?",
        "answers": [
            {
                text: "Pour minimiser les répercussions physiques à court terme",
                isCorrect: false,
                comment: "Les signes de détresse psychologique sont importants à prendre en compte non seulement pour les répercussions physiques, mais aussi pour les répercussions émotionnelles à court et à long terme."
            },
            {
                text: "Pour faciliter le travail des secouristes en les informant des manifestations émotionnelles",
                isCorrect: false,
                comment: "Bien que cela puisse aider les secouristes à comprendre l'état émotionnel de la victime, la prise en compte des signes de détresse psychologique vise principalement à limiter les répercussions négatives à court et long terme pour la victime elle-même."
            },
            {
                text: "Pour éviter des complications dans l'évaluation de la situation médicale",
                isCorrect: false,
                comment: "La prise en compte des signes de détresse psychologique n'a pas pour objectif principal d'éviter des complications dans l'évaluation médicale, mais plutôt de répondre aux besoins émotionnels de la victime."
            },
            {
                text: "Pour limiter les répercussions négatives à court et long terme",
                isCorrect: true,
                comment: "C'est l'objectif principal de la prise en compte des signes de détresse psychologique chez une victime, car cela peut aider à réduire les conséquences émotionnelles à court et à long terme."
            }
        ]
      },
      {
        "text": "Quel impact l'expression du visage et le regard d'une personne peuvent-ils avoir sur l'évaluation de son état affectif selon le texte ?",
        "answers": [
            {
                text: "Aucun, car ces éléments sont souvent trompeurs",
                isCorrect: false,
                comment: "L'expression faciale et le regard peuvent fournir des indications importantes sur l'état émotionnel d'une personne, bien que cela puisse varier d'une personne à l'autre."
            },
            {
                text: "Ils peuvent révéler des émotions et des états affectifs",
                isCorrect: true,
                comment: "L'expression faciale et le regard peuvent en effet fournir des indices sur les émotions et les états affectifs d'une personne, aidant ainsi à comprendre son état émotionnel."
            },
            {
                text: "Ils indiquent toujours une détresse psychologique",
                isCorrect: false,
                comment: "Bien que l'expression faciale et le regard puissent indiquer une détresse psychologique chez certaines personnes, ce n'est pas toujours le cas pour tout le monde."
            },
            {
                text: "Ils sont uniquement utiles pour évaluer les blessures visibles",
                isCorrect: false,
                comment: "L'expression faciale et le regard peuvent fournir des informations sur l'état émotionnel d'une personne, mais ils ne sont pas spécifiquement liés à l'évaluation des blessures visibles."
            }
        ]
      },
      {
        "text": "Qu'est-ce que l'hypervigilance peut indiquer chez une victime ?",
        "answers": [
            {
                text: "Une conscience claire de la situation",
                isCorrect: false,
                comment: "L'hypervigilance ne se manifeste pas nécessairement par une conscience claire de la situation, mais plutôt par une vigilance excessive et une réaction exagérée aux stimuli environnementaux."
            },
            
            {
                text: "Une attitude généralement calme et coopérante",
                isCorrect: false,
                comment: "L'hypervigilance se caractérise plutôt par une vigilance excessive et une réaction exagérée, ce qui est souvent en contradiction avec une attitude calme et coopérante."
            },
            {
                text: "Une augmentation de la perception de la douleur",
                isCorrect: false,
                comment: "Bien que l'hypervigilance puisse être associée à une sensibilité accrue aux stimuli environnementaux, elle n'entraîne pas nécessairement une augmentation de la perception de la douleur."
            },
            {
              text: "Un état de désorientation temporelle et spatiale",
              isCorrect: true,
              comment: "L'hypervigilance peut entraîner une désorientation temporelle et spatiale chez une victime, car elle peut être tellement concentrée sur la recherche de menaces potentielles qu'elle perd le contact avec la réalité environnante."
          },
        ]
      },
      {
        "text": "Quels éléments doivent être pris en compte lors de l'évaluation de l'état de conscience d'une victime, selon le texte ?",
        "answers": [
            {
                text: "La mémoire et la gestuelle",
                isCorrect: false,
                comment: "Bien que la mémoire et la gestuelle puissent être des indicateurs importants, l'évaluation de l'état de conscience se concentre principalement sur le comportement et le langage de la victime."
            },
            {
                text: "Le comportement et le langage",
                isCorrect: true,
                comment: "Le comportement et le langage sont des éléments clés de l'évaluation de l'état de conscience d'une victime, car ils peuvent fournir des informations sur sa réactivité et sa capacité à interagir avec son environnement."
            },
            {
                text: "La gestuelle et la vigilance",
                isCorrect: false,
                comment: "Bien que la gestuelle et la vigilance puissent être des aspects pertinents de l'évaluation de l'état de conscience, elles ne sont pas aussi directement liées que le comportement et le langage."
            },
            {
                text: "Le jugement et le raisonnement",
                isCorrect: false,
                comment: "Le jugement et le raisonnement peuvent être affectés par l'état de conscience d'une victime, mais ils ne sont pas les principaux éléments pris en compte lors de son évaluation initiale."
            }
        ]
      },
      
      {
        "text": "Quel est l'objectif principal de la stabilisation de la victime lors de l'action de secours ?",
        "answers": [
            {
                text: "Réduire la durée totale de l'intervention médicale",
                isCorrect: false,
                comment: "La stabilisation de la victime vise principalement à limiter les effets nocifs physiologiques et psychologiques du stress, plutôt qu'à réduire la durée totale de l'intervention médicale."
            },
            {
                text: "Augmenter la détresse psychologique de la victime",
                isCorrect: false,
                comment: "L'objectif de la stabilisation de la victime n'est pas d'augmenter sa détresse psychologique, mais plutôt de la réduire en limitant les effets nocifs du stress."
            },
            {
                text: "Limiter les effets nocifs physiologiques et psychologiques du stress",
                isCorrect: true,
                comment: "La stabilisation de la victime vise à limiter les effets nocifs du stress, à la fois sur le plan physiologique et psychologique, pour favoriser une meilleure récupération."
            },
            {
                text: "Améliorer la communication entre le secouriste et la victime",
                isCorrect: false,
                comment: "Bien que la communication puisse être un élément important de l'intervention, l'objectif principal de la stabilisation de la victime est de limiter les effets nocifs du stress."
            }
        ]
      },
      {
        "text": "Quels sont les canaux de communication utilisés par le secouriste pour focaliser l'attention de la victime ?",
        "answers": [
            {
                text: "Le canal olfactif, le toucher et la parole",
                isCorrect: false,
                comment: "Les canaux de communication utilisés pour focaliser l'attention de la victime incluent principalement le canal auditif, kinesthésique et visuel, qui permettent une communication efficace même dans des situations stressantes."
            },
            {
                text: "Le canal auditif, kinesthésique et visuel",
                isCorrect: true,
                comment: "Ces canaux de communication permettent une communication efficace avec la victime, en utilisant à la fois l'audition, le mouvement corporel et la vision pour focaliser son attention."
            },
            {
                text: "Le canal kinesthésique, la respiration et le regard",
                isCorrect: false,
                comment: "Bien que certains de ces éléments puissent être utilisés dans la communication, les principaux canaux pour focaliser l'attention de la victime sont l'auditif, le kinesthésique et le visuel."
            },
            {
                text: "Le canal visuel, la pensée et la respiration",
                isCorrect: false,
                comment: "Ces éléments peuvent être importants dans certaines situations, mais ils ne sont pas les canaux principaux utilisés par le secouriste pour focaliser l'attention de la victime."
            }
        ]
      },
      
      {
        "text": "Quel est le but du code de communication établi entre le secouriste et la victime?",
        "answers": [
            {
                text: "Faciliter la coordination entre les secouristes",
                isCorrect: false,
                comment: "Le but principal du code de communication est d'assurer une communication claire entre le secouriste et la victime lorsque la parole est impossible, plutôt que de faciliter la coordination entre les secouristes."
            },
            {
                text: "Permettre à la victime de choisir son traitement médical",
                isCorrect: false,
                comment: "Bien que cela puisse être pertinent dans certaines situations, le code de communication est principalement utilisé pour assurer une communication claire lorsque la parole est impossible, plutôt que de permettre à la victime de choisir son traitement médical."
            },
            {
                text: "Assurer une communication claire lorsque la parole est impossible",
                isCorrect: true,
                comment: "Le code de communication est établi pour permettre une communication claire entre le secouriste et la victime, en utilisant des signaux convenus pour transmettre des informations lorsque la parole est impossible."
            },
            {
                text: "Aider la victime à se concentrer sur sa respiration",
                isCorrect: false,
                comment: "Bien que la respiration puisse être importante dans certaines situations, le but principal du code de communication est d'assurer une communication claire lorsque la parole est impossible."
            }
        ]
      },
      {
        "text": "Pourquoi le secouriste encourage-t-il la victime à se concentrer sur des sujets agréables pour elle ?",
        "answers": [
            {
                text: "Pour rendre l'intervention médicale plus rapide",
                isCorrect: false,
                comment: "Le but de cette action n'est pas de rendre l'intervention médicale plus rapide, mais plutôt de renforcer le sentiment de contrôle de la victime et de réduire sa détresse émotionnelle."
            },
            {
                text: "Pour que la victime ne soit plus en phase avec la réalité de la situation",
                isCorrect: false,
                comment: "Bien que cela puisse être un effet secondaire, le but principal d'encourager la victime à se concentrer sur des sujets agréables est de renforcer son sentiment de contrôle et de réduire sa détresse émotionnelle."
            },
            {
                text: "Pour renforcer le sentiment de contrôle de la victime",
                isCorrect: true,
                comment: "En encourageant la victime à se concentrer sur des sujets agréables pour elle, le secouriste cherche à renforcer son sentiment de contrôle sur la situation et à réduire sa détresse émotionnelle."
            },
            {
                text: "Pour augmenter la détresse psychologique de la victime",
                isCorrect: false,
                comment: "Le but du secouriste n'est pas d'augmenter la détresse psychologique de la victime, mais plutôt de la réduire en renforçant son sentiment de contrôle et en réduisant sa détresse émotionnelle."
            }
        ]
      },{
        "text": "Quel est l'objectif principal de l'écoute active lors de l'intervention d'un secouriste ?",
        "answers": [
            {
                text: "Proposer des solutions aux problèmes de la victime",
                isCorrect: false,
                comment: "L'objectif de l'écoute active n'est pas de proposer des solutions, mais plutôt de renforcer positivement la participation de la victime dans la résolution de ses problèmes."
            },
            {
                text: "Juger négativement les actions de la victime pour la motiver",
                isCorrect: false,
                comment: "La critique négative n'est pas une composante de l'écoute active. L'objectif est de renforcer positivement la participation de la victime."
            },
            {
                text: "Renforcer positivement la participation de la victime",
                isCorrect: true,
                comment: "L'écoute active vise à encourager la participation active de la victime en renforçant positivement son implication dans la résolution de ses problèmes."
            },
            {
                text: "Rationaliser les réactions émotionnelles de la victime",
                isCorrect: false,
                comment: "L'objectif principal n'est pas de rationaliser les réactions émotionnelles de la victime, mais plutôt de renforcer positivement sa participation."
            }
        ]
      },
      {
        "text": "Qu'est-ce que la phase de 'recontextualisation' implique pour le secouriste ?",
        "answers": [
            {
                text: "Offrir des conseils pour résoudre le problème de la victime",
                isCorrect: false,
                comment: "La phase de recontextualisation ne consiste pas à offrir des conseils, mais plutôt à poser des questions ouvertes pour clarifier le contexte de la situation."
            },
            {
                text: "Juger la situation de manière critique pour aider la victime à comprendre",
                isCorrect: false,
                comment: "La phase de recontextualisation n'implique pas de jugement critique, mais plutôt une compréhension approfondie de la situation par le biais de questions ouvertes."
            },
            {
                text: "Poser des questions ouvertes pour clarifier le contexte de la situation",
                isCorrect: true,
                comment: "La phase de recontextualisation consiste à poser des questions ouvertes pour clarifier le contexte de la situation, permettant ainsi une meilleure compréhension de la problématique."
            },
            {
                text: "Consoler la victime en minimisant son problème",
                isCorrect: false,
                comment: "La recontextualisation ne vise pas à minimiser le problème de la victime, mais plutôt à clarifier le contexte de la situation."
            }
        ]
      },
      {
        "text": "Quelle est la principale action du secouriste lors de la phase de 'reformulation' ?",
        "answers": [
            {
                text: "Proposer des solutions alternatives à la victime",
                isCorrect: false,
                comment: "La reformulation ne consiste pas à proposer des solutions alternatives, mais plutôt à reprendre les propos de la victime pour clarifier leur signification."
            },
            {
                text: "Reprendre les propos de la victime pour clarifier leur signification",
                isCorrect: true,
                comment: "La principale action lors de la phase de reformulation est de reprendre les propos de la victime pour clarifier leur signification, favorisant ainsi une meilleure compréhension de ses préoccupations."
            },
            {
                text: "Faire des comparaisons avec d'autres situations similaires",
                isCorrect: false,
                comment: "La reformulation ne consiste pas principalement à faire des comparaisons, même si c'est posssible, il s'agit plutôt de reformuler les propos de la victime pour une meilleure compréhension."
            },
            {
                text: "Consoler la victime en minimisant ses préoccupations",
                isCorrect: false,
                comment: "La reformulation ne vise pas à minimiser les préoccupations de la victime, mais plutôt à les clarifier pour une meilleure communication."
            }
        ]
      },
      
      {
        "text": "Quel est l'objectif principal de la respiration contrôlée lors d'une intervention de secours ?",
        "answers": [
            {
                "text": "Accélérer le rythme respiratoire pour dynamiser la victime",
                "isCorrect": false,
                "comment": "L'objectif de la respiration contrôlée n'est pas d'accélérer le rythme respiratoire, mais plutôt d'induire une respiration relaxante pour détendre et calmer la victime."
            },
            {
                "text": "Induire une respiration relaxante pour détendre et calmer la victime",
                "isCorrect": true,
                "comment": "La respiration contrôlée vise principalement à induire une respiration relaxante pour détendre et calmer la victime, favorisant ainsi une meilleure gestion du stress."
            },
            {
                "text": "Mobiliser le système sympathique pour augmenter la vigilance",
                "isCorrect": false,
                "comment": "La respiration contrôlée vise à activer le système parasympathique pour favoriser la détente, plutôt que de mobiliser le système sympathique pour augmenter la vigilance."
            },
            {
                "text": "Favoriser une respiration rapide et superficielle pour stimuler la circulation sanguine",
                "isCorrect": false,
                "comment": "La respiration contrôlée n'a pas pour objectif de favoriser une respiration rapide et superficielle, mais plutôt une respiration relaxante pour détendre la victime."
            }
        ]
      },
      {
        "text": "Pourquoi est-il important de prolonger le temps d'expiration lors de la respiration contrôlée ?",
        "answers": [
            {
                "text": "Pour augmenter la vigilance et l'activité musculaire de la victime",
                "isCorrect": false,
                "comment": "Prolonger le temps d'expiration favorise la détente en activant le système parasympathique, ce qui réduit la vigilance et l'activité musculaire."
            },
            {
                "text": "Pour favoriser la détente en activant le système parasympathique",
                "isCorrect": true,
                "comment": "Prolonger le temps d'expiration lors de la respiration contrôlée permet d'activer le système parasympathique, favorisant ainsi la détente et la relaxation de la victime."
            },
            {
                "text": "Pour induire une inspiration profonde et dynamisante",
                "isCorrect": false,
                "comment": "Prolonger le temps d'expiration ne vise pas à induire une inspiration profonde et dynamisante, mais plutôt à favoriser la détente en activant le système parasympathique."
            },
            {
                text: "Pour stimuler la sécrétion d'adrénaline et accélérer le rythme cardiaque",
                isCorrect: false,
                comment: "Prolonger le temps d'expiration ne vise pas à stimuler la sécrétion d'adrénaline, mais plutôt à favoriser la détente en activant le système parasympathique."
            }
        ]
      },
      {
        "text": "Quelle est la différence entre la respiration complète et la respiration abdominale ?",
        "answers": [
            {
                text: "La respiration complète implique uniquement le thorax tandis que la respiration abdominale implique le ventre",
                isCorrect: false,
                comment: "La respiration complète mobilise les trois étages respiratoires, tandis que la respiration abdominale se concentre principalement sur le ventre."
            },
            {
                text: "La respiration complète mobilise les trois étages respiratoires tandis que la respiration abdominale se concentre sur le ventre",
                isCorrect: true,
                comment: "La principale différence entre la respiration complète et la respiration abdominale est que la première mobilise les trois étages respiratoires tandis que la seconde se concentre sur le ventre."
            },
            {
                text: "La respiration complète est plus dynamisante que la respiration abdominale",
                isCorrect: false,
                comment: "La dynamisation n'est pas une caractéristique exclusive de la respiration complète par rapport à la respiration abdominale."
            },
            {
                text: "La respiration complète est recommandée en cas de stress extrême",
                isCorrect: false,
                comment: "La recommandation de la respiration complète ou abdominale dépend de la situation et des besoins individuels, et non pas du niveau de stress."
            }
        ]
      },
      
      {
        "text": "Quels sont les risques potentiels associés à la respiration contrôlée lors d'une intervention de secours?",
        "answers": [
            {
                text: "Augmentation de la détente et de la relaxation chez la victime",
                isCorrect: false,
                comment: "La respiration contrôlée vise à favoriser la détente et la relaxation, plutôt qu'à augmenter ces états chez la victime."
            },
            {
                text: "Diminution de la vigilance et de la réponse aux stimuli externes",
                isCorrect: true,
                comment: "L'un des risques potentiels de la respiration contrôlée est la diminution de la vigilance et de la réponse aux stimuli externes, ce qui pourrait être préjudiciable dans certaines situations d'urgence."
            },
            {
                text: "Activation excessive du système sympathique chez la victime",
                isCorrect: false,
                comment: "Bien que la respiration contrôlée puisse activer le système parasympathique, elle n'entraîne généralement pas une activation excessive du système sympathique."
            },
            {
                text: "Amélioration de la coordination musculaire et de l'équilibre",
                isCorrect: false,
                comment: "Bien que la respiration contrôlée puisse avoir des effets bénéfiques sur le corps, tels que la détente musculaire, elle peut également présenter des risques, tels que la diminution de la vigilance."
            }
        ]
      },
      {
        "text": "Quel est l'objectif principal des techniques de focalisation et de défocalisation de l'attention lors d'une intervention de secours ?",
        "answers": [
            {
                "text": "Accroître la vulnérabilité émotionnelle de la victime",
                "isCorrect": false,
                "comment": "Les techniques de focalisation et de défocalisation de l'attention visent plutôt à stabiliser l'état psychologique de la victime et à favoriser le bon déroulement de l'intervention, plutôt qu'à accroître sa vulnérabilité émotionnelle."
            },
            {
                "text": "Réduire la capacité de la victime à se concentrer",
                "isCorrect": false,
                "comment": "L'objectif n'est pas de réduire la capacité de la victime à se concentrer, mais plutôt de stabiliser son état psychologique pour faciliter l'intervention."
            },
            {
                "text": "Stabiliser l'état psychologique de la victime et favoriser le bon déroulement de l'intervention",
                "isCorrect": true,
                "comment": "Le principal objectif des techniques de focalisation et de défocalisation de l'attention est de stabiliser l'état psychologique de la victime et de favoriser le bon déroulement de l'intervention en limitant les effets négatifs du stress."
            },
            {
                "text": "Intensifier les facteurs de stress liés à l'événement critique",
                "isCorrect": false,
                "comment": "Les techniques de focalisation et de défocalisation de l'attention ont pour but de réduire les facteurs de stress plutôt que de les intensifier."
            }
        ]
      },
      
      
      {
        "text": "Quelle est la différence entre la visualisation conformiste et la visualisation créatrice ?",
        "answers": [
            {
                "text": "La visualisation conformiste se concentre sur des objets réels, tandis que la visualisation créatrice imagine des scénarios abstraits.",
                "isCorrect": true,
                "comment": "La principale différence entre la visualisation conformiste et la visualisation créatrice est que la première se concentre sur des objets réels tandis que la seconde imagine des scénarios abstraits."
            },
            {
                "text": "La visualisation conformiste est accessible à tous, tandis que la visualisation créatrice est réservée aux personnes créatives.",
                "isCorrect": false,
                "comment": "La différence entre la visualisation conformiste et la visualisation créatrice réside dans leur approche respective, pas dans la capacité des individus à les pratiquer."
            },
            {
                "text": "La visualisation conformiste nécessite une concentration extrême, tandis que la visualisation créatrice est plus détendue.",
                "isCorrect": false,
                "comment": "La concentration requise pour la visualisation conformiste et la visualisation créatrice peut varier en fonction des préférences individuelles, mais cela n'est pas une différence fondamentale entre les deux."
            },
            {
                "text": "La visualisation conformiste provoque des changements physiologiques, tandis que la visualisation créatrice n'a aucun effet sur le corps.",
                "isCorrect": false,
                "comment": "La visualisation créatrice peut également provoquer des changements physiologiques, notamment en influençant les réponses émotionnelles et les niveaux de stress."
            }
        ]
      },
      {
        "text": "Quel est l'objectif principal de la visualisation dans la régulation du stress?",
        "answers": [
            {
                "text": "Créer des sensations de peur et d'anxiété chez la victime",
                "isCorrect": false,
                "comment": "L'objectif de la visualisation dans la régulation du stress n'est pas de créer des sensations de peur et d'anxiété, mais plutôt de susciter une réaction de détente et de bien-être chez la victime."
            },
            {
                "text": "Susciter une réaction de détente et de bien-être chez la victime",
                "isCorrect": true,
                "comment": "La visualisation dans la régulation du stress vise principalement à susciter une réaction de détente et de bien-être chez la victime, contribuant ainsi à atténuer les effets du stress."
            },
            {
                "text": "Accroître la vigilance de la victime face aux stimuli externes",
                "isCorrect": false,
                "comment": "La visualisation dans la régulation du stress ne vise pas à accroître la vigilance de la victime, mais plutôt à favoriser la relaxation et la réduction du stress."
            },
            {
                "text": "Stimuler la production d'adrénaline chez la victime",
                "isCorrect": false,
                "comment": "Stimuler la production d'adrénaline n'est pas l'objectif de la visualisation dans la régulation du stress, car cela pourrait aggraver la réaction de stress plutôt que de l'atténuer."
            }
        ]
      },
      {
        "text": "Qu'est-ce que le bilan dans le contexte des premiers secours ?",
        "answers": [
            {
                "text": "Une évaluation globale de l'état physique uniquement de la victime.",
                "isCorrect": false,
                "comment": "Non, une évaluation globale est importante, mais le bilan comprend plus que cela."
            },
            {
                "text": "Un enregistrement des actions entreprises uniquement durant l'intervention.",
                "isCorrect": false,
                "comment": "Ce n'est pas la définition du bilan dans ce contexte."
            },
            {
                "text": "Une phase de recueil d'informations permettant d'évaluer une situation et l'état d'une victime.",
                "isCorrect": true,
                "comment": "Correct, le bilan consiste à recueillir des informations pour évaluer la situation et l'état de la victime."
            },
            {
                "text": "Un résumé des symptômes de la victime à transmettre au médecin après l'intervention.",
                "isCorrect": false,
                "comment": "Le bilan est effectué pendant l'intervention pour orienter les actions des secouristes, pas après."
            }
        ]
    },
    {
        "text": "Quel est l'un des objectifs principaux du bilan dans les premiers secours ?",
        "answers": [
            {
                "text": "Assurer la mise en sécurité des témoins uniquement.",
                "isCorrect": false,
                "comment": "La mise en sécurité des témoins est importante, mais ce n'est pas le seul objectif du bilan."
            },
            {
                "text": "Evaluer la situation dans sa globalité pour déceler d'éventuels dangers.",
                "isCorrect": true,
                "comment": "Oui, le bilan vise à évaluer la situation dans son ensemble pour identifier les dangers potentiels."
            },
            {
                "text": "Identifier la plainte principale de la victime dès le premier regard.",
                "isCorrect": false,
                "comment": "Ce n'est pas l'objectif principal du bilan, bien que cela puisse être important."
            },
            {
                "text": "Consigner uniquement les actions entreprises durant l'intervention.",
                "isCorrect": false,
                "comment": "Le bilan ne se limite pas à consigner les actions, mais vise à évaluer la situation et l'état de la victime."
            }
        ]
    },
    {
        "text": "Quel principe guide le début du bilan dans les premiers secours ?",
        "answers": [
            {
                "text": "Commencer par traiter les blessures visibles.",
                "isCorrect": false,
                "comment": "Ce n'est pas le principe de base du bilan dans ce contexte."
            },
            {
                "text": "Rechercher et traiter en priorité 'ce qui tue en premier'.",
                "isCorrect": true,
                "comment": "Oui, il est essentiel de rechercher et de traiter en priorité les situations qui menacent la vie de la victime."
            },
            {
                "text": "Commencer par un interrogatoire détaillé de la victime.",
                "isCorrect": false,
                "comment": "L'interrogatoire peut être important, mais ce n'est pas le début du bilan."
            },
            {
                "text": "Débuter par une évaluation détaillée des paramètres vitaux.",
                "isCorrect": false,
                "comment": "Les paramètres vitaux sont évalués pendant le bilan, mais ce n'est pas le début."
            }
        ]
    },
    {
        "text": "Quel regard du bilan se concentre sur une évaluation hiérarchisée et structurée des fonctions vitales ?",
        "answers": [
            {
                "text": "Le premier regard.",
                "isCorrect": false,
                "comment": "Non, ce regard concerne l'appréciation globale de la situation."
            },
            {
                "text": "Le deuxième regard.",
                "isCorrect": false,
                "comment": "Ce regard se concentre sur l'identification d'une menace vitale et la plainte principale."
            },
            {
                "text": "Le troisième regard.",
                "isCorrect": true,
                "comment": "Oui, le troisième regard du bilan se concentre sur une évaluation hiérarchisée des fonctions vitales."
            },
            {
                "text": "Le quatrième regard.",
                "isCorrect": false,
                "comment": "Ce regard se concentre sur l'interrogatoire approfondi et l'examen de la victime."
            }
        ]
    },
    {
        "text": "Que doit-on consigner et transmettre à l'équipe qui prend le relai après une intervention ?",
        "answers": [
            {
                "text": "Uniquement les actions entreprises durant l'intervention.",
                "isCorrect": false,
                "comment": "Ce n'est pas suffisant pour assurer une transition efficace."
            },
            {
                "text": "Seulement les informations sur les détresses vitales.",
                "isCorrect": false,
                "comment": "Les informations sur les détresses vitales sont importantes, mais ce n'est pas tout ce qui doit être consigné."
            },
    
            {
                "text": "Uniquement les paramètres vitaux mesurés pendant l'intervention.",
                "isCorrect": false,
                "comment": "Les paramètres vitaux sont importants, mais ce n'est pas tout ce qui doit être consigné."
            },
            {
                "text": "La synthèse des informations et des actions entreprises durant toute l'intervention.",
                "isCorrect": true,
                "comment": "Oui, il est essentiel de consigner et de transmettre une synthèse complète des informations et des actions."
            },
    
        ]
    },
    {
        "text": "Qu'est-ce que réalise l'équipe d'intervention lors du premier regard ?",
        "answers": [
            {
                "text": "Une évaluation détaillée de l'état de la victime.",
                "isCorrect": false,
                "comment": "Non, le premier regard consiste en une vision globale de la situation et des lieux."
            },
            {
                "text": "Une évaluation des symptômes de la victime.",
                "isCorrect": false,
                "comment": "Ce n'est pas le but du premier regard dans ce contexte."
            },
            {
                "text": "Une vision globale de la situation et des lieux d'intervention.",
                "isCorrect": true,
                "comment": "Correct, le premier regard vise à observer la scène et les circonstances de survenue."
            },
            {
                "text": "Une identification des antécédents médicaux de la victime.",
                "isCorrect": false,
                "comment": "Ce n'est pas le rôle du premier regard."
            }
        ]
    },
    {
        "text": "Quel est un des deux principes clés du deuxième regard dans les premiers secours ?",
        "answers": [
            {
                "text": "Observer la victime dans sa globalité.",
                "isCorrect": true,
                "comment": "Oui, lors du deuxième regard, il est essentiel d'observer la victime dans son ensemble pour évaluer son état."
            },
            {
                "text": "Se concentrer uniquement sur les menaces vitales.",
                "isCorrect": false,
                "comment": "Les menaces vitales sont importantes, mais il faut aussi observer la victime dans sa globalité."
            },
            {
                "text": "Se focaliser sur la plainte principale de la victime.",
                "isCorrect": false,
                "comment": "La plainte principale est un aspect à prendre en compte, mais ce n'est pas le seul du deuxième regard."
            },
            {
                "text": "Déterminer l'âge exact de la victime.",
                "isCorrect": false,
                "comment": "L'âge est une information importante, mais ce n'est pas le but principal du deuxième regard."
            }
        ]
    },
    {
        "text": "Quelle action est recommandée si la victime exprime une plainte principale lors du deuxième regard ?",
        "answers": [
            {
                "text": "Installer la victime dans une position adaptée à son état.",
                "isCorrect": true,
                "comment": "Oui, il est important d'installer la victime dans une position confortable en fonction de sa plainte principale."
            },
            {
                "text": "Demander immédiatement des moyens complémentaires.",
                "isCorrect": false,
                "comment": "C'est une action à entreprendre si nécessaire, mais ce n'est pas le premier réflexe en cas de plainte principale."
            },
            {
                "text": "Observer la victime dans sa globalité.",
                "isCorrect": false,
                "comment": "C'est une action du deuxième regard, mais ce n'est pas spécifique à une plainte principale."
            },
            {
                "text": "Rechercher une réaction anormale sans respiration.",
                "isCorrect": false,
                "comment": "C'est une action en cas de détresse vitale, mais ce n'est pas spécifique à une plainte principale."
            }
        ]
    },
    {
        "text": "Quel est le principe de base suivi lors de l'évaluation des fonctions vitales lors du troisième regard ?",
        "answers": [
            {
                "text": "Traiter en priorité ce qui tue en premier.",
                "isCorrect": true,
                "comment": "Oui, lors de l'évaluation des fonctions vitales, il est essentiel de traiter en priorité ce qui peut mettre la vie de la victime en danger."
            },
            {
                "text": "Evaluer d'abord la fonction cardiaque.",
                "isCorrect": false,
                "comment": "L'évaluation des fonctions vitales se fait selon un ordre spécifique, mais ce n'est pas nécessairement la fonction cardiaque en premier."
            },
            {
                "text": "Mesurer d'abord les paramètres physiologiques vitaux.",
                "isCorrect": false,
                "comment": "Les paramètres physiologiques vitaux sont mesurés après l'évaluation des fonctions vitales, ce n'est pas le principe de base du troisième regard."
            },
            {
                "text": "Demander immédiatement un avis médical en cas de détresse identifiée.",
                "isCorrect": false,
                "comment": "Demander un avis médical est important, mais ce n'est pas le principe de base de l'évaluation des fonctions vitales."
            }
        ]
    },
    {
        "text": "Que doit faire le secouriste dès qu'une détresse est identifiée lors de l'évaluation des fonctions vitales ?",
        "answers": [
            {
                "text": "Réaliser immédiatement les gestes de premiers secours appropriés et demander un avis médical.",
                "isCorrect": true,
                "comment": "Oui, dès qu'une détresse est identifiée, il est crucial de prendre des mesures immédiates pour sauver la vie de la victime et de demander un avis médical."
            },
            {
                "text": "Continuer l'examen de la fonction concernée avant de prendre des mesures.",
                "isCorrect": false,
                "comment": "Il est important de réagir immédiatement en cas de détresse, sans attendre la fin de l'examen de la fonction concernée."
            },
            {
                "text": "Demander à l'entourage de fournir des informations supplémentaires sur la situation.",
                "isCorrect": false,
                "comment": "C'est une bonne pratique, mais ce n'est pas la première action à entreprendre en cas de détresse identifiée."
            },
            {
                "text": "Commencer par mesurer l'ensemble des paramètres physiologiques vitaux de la victime.",
                "isCorrect": false,
                "comment": "La mesure des paramètres physiologiques vitaux est importante, mais ce n'est pas la première action à prendre en cas de détresse identifiée."
            }
        ]
    },
    {
        "text": "Qu'est-ce qui constitue la dernière étape du quatrième regard dans le processus d'évaluation d'une victime ?",
        "answers": [
            {
                text: "L'examen approfondi de la victime à la recherche de lésions et autres atteintes.",
                isCorrect: true,
                comment: "Oui, la dernière étape du quatrième regard implique un examen détaillé de la victime pour détecter d'éventuelles lésions ou atteintes."
            },
            {
                text: "La mesure des paramètres physiologiques vitaux.",
                isCorrect: false,
                comment: "La mesure des paramètres physiologiques est importante mais elle n'est pas la dernière étape du quatrième regard."
            },
            {
                text: "La recherche des antécédents médicaux de la victime.",
                isCorrect: false,
                comment: "C'est une partie importante du quatrième regard, mais ce n'est pas la dernière étape."
            },
            {
                text: "La transmission des éléments recueillis au médecin régulateur.",
                isCorrect: false,
                comment: "La transmission des éléments se fait à la fin, mais ce n'est pas la dernière étape du quatrième regard."
            }
        ]
    },
    {
        "text": "Quelle est la première étape de l'interrogatoire de la victime ou de son entourage lors du quatrième regard ?",
        "answers": [
            {
                text: "La recherche du mécanisme de l'accident, de l'évènement ou de l'histoire de la maladie.",
                isCorrect: true,
                comment: "Oui la première étape de l'interrogatoire consiste à comprendre ce qui s'est passé pour la victime ou comment la maladie est survenue.",
            },
            {
                text: "La recherche des antécédents médicaux de la victime.",
                isCorrect: false,
                comment: "C'est une étape ultérieure de l'interrogatoire, mais ce n'est pas la première."
            },
            {
                text: "L'analyse des plaintes exprimées par la victime.",
                isCorrect: false,
                comment: "C'est une partie importante de l'interrogatoire, mais ce n'est pas la première étape."
            },
            {
                text: "La mesure des paramètres physiologiques vitaux de la victime.",
                isCorrect: false,
                comment: "La mesure des paramètres physiologiques est importante mais elle intervient après cette première étape de l'interrogatoire."
            }
        ] 
    },  
    {
        "text": "Quel est l'objectif principal de la recherche des antécédents lors du quatrième regard ?",
        "answers": [
            {
                text: "Connaître l'état de santé préalable de la victime.",
                isCorrect: true,
                comment: "Oui, l'objectif principal de la recherche des antécédents est de comprendre l'état de santé antérieur de la victime."
            },
            {
                text: "Identifier les symptômes d'apparition récente chez la victime.",
                isCorrect: false,
                comment: "C'est une partie de l'objectif, mais ce n'est pas le principal objectif de cette recherche."
            },
            {
                text: "Déterminer les éventuelles causes de l'accident ou de la maladie.",
                isCorrect: false,
                comment: "La recherche des antécédents vise principalement à comprendre l'état de santé antérieur de la victime, pas nécessairement les causes de l'accident ou de la maladie."
            },
            {
                text: "Évaluer la sévérité des symptômes exprimés par la victime.",
                isCorrect: false,
                comment: "L'évaluation de la sévérité est importante, mais ce n'est pas l'objectif principal de la recherche des antécédents."
            }
        ]
    },
    {
        "text": "Quelle est la première étape de l'interrogatoire de la victime ou de son entourage lors du quatrième regard ?",
        "answers": [
            {
                text: "La recherche du mécanisme de l'accident, de l'évènement ou de l'histoire de la maladie.",
                isCorrect: true,
                comment: "Oui, la première étape de l'interrogatoire consiste à comprendre ce qui s'est passé pour la victime ou comment la maladie est survenue."
            },
            {
                text: "La recherche des antécédents médicaux de la victime.",
                isCorrect: false,
                comment: "C'est une étape ultérieure de l'interrogatoire, mais ce n'est pas la première."
            },
            {
                text: "L'analyse des plaintes exprimées par la victime.",
                isCorrect: false,
                comment: "C'est une partie importante de l'interrogatoire, mais ce n'est pas la première étape."
            },
            {
                text: "La mesure des paramètres physiologiques vitaux de la victime.",
                isCorrect: false,
                comment: "La mesure des paramètres physiologiques est importante mais elle intervient après cette première étape de l'interrogatoire."
            }
        ]
    },
    {
        "text": "Qu'est-ce qui constitue la dernière étape du quatrième regard dans le processus d'évaluation d'une victime ?",
        "answers": [
            {
                text: "L'examen approfondi de la victime à la recherche de lésions et autres atteintes.",
                isCorrect: true,
                comment: "Oui, la dernière étape du quatrième regard implique un examen détaillé de la victime pour détecter d'éventuelles lésions ou atteintes."
            },
            {
                text: "La mesure des paramètres physiologiques vitaux.",
                isCorrect: false,
                comment: "La mesure des paramètres physiologiques est importante mais elle n'est pas la dernière étape du quatrième regard."
            },
            {
                text: "La recherche des antécédents médicaux de la victime.",
                isCorrect: false,
                comment: "C'est une partie importante du quatrième regard, mais ce n'est pas la dernière étape."
            },
            {
                text: "La transmission des éléments recueillis au médecin régulateur.",
                isCorrect: false,
                comment: "La transmission des éléments se fait à la fin, mais ce n'est pas la dernière étape du quatrième regard."
            }
        ]
    },
    
    {
        "text": "Quand débute la surveillance de l'état de la victime selon les informations fournies ?",
        "answers": [
            {
                text: "Dès le 2ème regard.",
                isCorrect: true,
                comment: "Oui, la surveillance de l'état de la victime commence dès le 2ème regard, selon les informations fournies."
            },
            {
                text: "Dès le début de l'intervention.",
                isCorrect: false,
                comment: "Non, la surveillance ne débute pas dès le début de l'intervention mais après le 2ème regard."
            },
            {
                text: "Après la transmission de la victime à l'équipe de renfort.",
                isCorrect: false,
                comment: "Non, la surveillance débute avant la transmission de la victime à l'équipe de renfort."
            },
            {
                text: "Une fois toutes les 30 minutes.",
                isCorrect: false,
                comment: "Non, la surveillance est plus fréquente que toutes les 30 minutes, elle est constante et renouvelée régulièrement."
            }
        ]
    },
    {
        "text": "Quels sont les destinataires des informations concernant les changements d'état de la victime ?",
        "answers": [
            {
                text: "Le médecin régulateur, l'équipe de renfort éventuelle et l'équipe chargée d'assurer la continuité des soins.",
                isCorrect: true,
                comment: "Effectivement, les informations sur les changements d'état de la victime doivent être transmises à ces destinataires selon les informations fournies."
            },
            {
                text: "Seulement à l'équipe chargée d'assurer la continuité des soins.",
                isCorrect: false,
                comment: "Non, plusieurs destinataires doivent être informés des changements d'état de la victime."
            },
            {
                text: "Uniquement au médecin régulateur.",
                isCorrect: false,
                comment: "Non, bien que le médecin régulateur soit important, d'autres équipes doivent également être informées."
            },
            {
                text: "Il n'est pas nécessaire de transmettre ces informations.",
                isCorrect: false,
                comment: "Ce n'est pas correct, il est crucial de transmettre les informations sur les changements d'état de la victime pour assurer une prise en charge appropriée."
            }
        ]
    },{
        "text": "Quels sont les gestes à éviter lors de la prise en charge d'une victime de noyade ?",
        "answers": [
            {
                text: "Sécher prudemment la victime après son dégagement de l'eau",
                isCorrect: false,
                comment: "Incorrect. Il est important de sécher la victime pour éviter l'hypothermie, mais cela ne doit pas retarder les premiers secours."
            },
            {
                text: "Utiliser des couvertures pour protéger la victime du vent",
                isCorrect: false,
                comment: "Incorrect. Utiliser des couvertures peut aider à maintenir la chaleur corporelle de la victime, ce qui est bénéfique dans certains cas de noyade."
            },
            {
              text: "Effectuer des mobilisations intempestives lors du déshabillage de la victime",
              isCorrect: true,
              comment: "Correct. Il est important d'éviter les mobilisations intempestives qui pourraient aggraver les blessures ou le traumatisme de la victime."
          },
          {
              text: "Surveiller attentivement la victime en continu",
              isCorrect: false,
              comment: "Incorrect. Surveiller la victime en continu est essentiel pour détecter tout changement dans son état et adapter les premiers secours en conséquence."
          }
    
        
    
        ]
    
      },
      {
        text: "Qu'est-ce que l'action de secours doit permettre lors d'un accident électrique ?",
        "answers": [
            {
                text: "Réparer les câbles endommagés.",
                isCorrect: false,
                comment: "La réparation des câbles endommagés est une tâche pour les professionnels de l'électricité, pas pour les secouristes."
            },
            {
                text: "Prendre des photos des blessures.",
                isCorrect: false,
                comment: "Prendre des photos des blessures peut être utile à des fins médicales, mais ce n'est pas l'objectif principal de l'action de secours lors d'un accident électrique."
            },
            {
                text: "Obtenir un avis médical, réaliser les gestes de secours adaptés et prendre en charge les brûlures.",
                isCorrect: true,
                comment: "L'action de secours lors d'un accident électrique doit permettre d'obtenir un avis médical, de réaliser les gestes de secours adaptés et de prendre en charge les brûlures."
            },
            {
                text: "Aucune des réponses précédentes.",
                isCorrect: false,
                comment: "La dernière option est incorrecte car l'action de secours doit comprendre plusieurs mesures pour aider la victime."
            }
        ]
    
    
      },
      {
        "text": "Quelle est la principale action recommandée lorsqu'une compression de membre est suspectée ?",
        "answers": [
            {
                "text": "Réaliser des massages cardiaques.",
                isCorrect: false,
                comment: "Incorrect. Réaliser des massages cardiaques n'est pas la principale action recommandée lorsqu'une compression de membre est suspectée."
            },
            {
                text: "Évaluer la durée de la compression et réaliser les gestes de secours adaptés.",
                isCorrect: true,
                comment: "Correct. La principale action recommandée lorsqu'une compression de membre est suspectée est d'évaluer la durée de la compression et de réaliser les gestes de secours adaptés."
            },
            {
                text: "Administrer un médicament anti-inflammatoire.",
                isCorrect: false,
                comment: "Incorrect. Administrer un médicament anti-inflammatoire n'est pas la principale action recommandée lorsqu'une compression de membre est suspectée."
            },
            {
                text: "Appliquer un pansement compressif.",
                isCorrect: false,
                comment: "Incorrect. Appliquer un pansement compressif n'est pas la principale action recommandée lorsqu'une compression de membre est suspectée."
            }
    
        ]
    },
    {
        "text": "Que doit-on faire en cas de détresse vitale associée à une compression de membre ?",
        "answers": [
            {
                text: "Rien, car la situation n'est pas grave.",
                isCorrect: false,
                comment: "Incorrect. En cas de détresse vitale, il est crucial d'agir rapidement pour aider la victime."
            },
            {
                text: "Appliquer un garrot.",
                isCorrect: false,
                comment: "Incorrect. Appliquer un garrot peut aggraver la situation dans le cas d'une détresse vitale associée à une compression de membre."
            },
            {
                text: "Appeler les secours médicaux d'urgence et réaliser les gestes de secours adaptés.",
                isCorrect: true,
                comment: "Correct. En cas de détresse vitale, il est essentiel d'appeler les secours médicaux d'urgence et de réaliser les gestes de secours appropriés pour aider la victime."
            },
            {
                text: "Continuer à comprimer le membre.",
                isCorrect: false,
                comment: "Incorrect. Continuer à comprimer le membre n'est pas la bonne approche en cas de détresse vitale, car cela peut aggraver la situation."
            }
        ]
    },
    {
      "text": "Quels sont les gestes à effectuer pour assurer le sauvetage aquatique d'une victime de noyade ?",
      answers: [
          {
              text: "Entrer dans l'eau rapidement et seul",
              isCorrect: false,
              comment: "Incorrect. Entrer rapidement dans l'eau peut mettre en danger le sauveteur. Il est préférable d'utiliser un moyen d'aide au sauvetage."
          },
          {
              text: "Utiliser un moyen d'aide au sauvetage et éviter de plonger tête la première",
              isCorrect: true,
              comment: "Correct. Il est recommandé d'utiliser un moyen d'aide au sauvetage tel qu'une bouée et d'éviter de plonger tête la première pour éviter les blessures."
          },
          {
              text: "Ne pas parler à la victime pour éviter la panique",
              isCorrect: false,
              comment: "Incorrect. Il est important de communiquer avec la victime pour la rassurer et lui indiquer les actions entreprises."
          },
          {
              text: "Plonger tête la première pour une meilleure propulsion",
              isCorrect: false,
              comment: "Incorrect. Plonger tête la première peut entraîner des blessures graves, surtout dans des eaux peu profondes ou inconnues."
          }
      ]
    },
    {
      "text": "Que doit faire un intervenant secouriste lorsqu'une victime est en contact avec un conducteur endommagé dans le cadre d'un accident electrique ?",
      "answers": [
          {
              text: "S'approcher immédiatement de la victime.",
              isCorrect: false,
              comment: "S'approcher immédiatement de la victime peut mettre en danger l'intervenant lui-même en cas de danger électrique."
          },
          {
              text: "Couper le courant si possible.",
              isCorrect: true,
              comment: "La première action à entreprendre est de couper le courant si cela est possible pour sécuriser la zone et éviter de nouvelles victimes."
          },
          {
              text: "Toucher la victime pour vérifier si elle est consciente.",
              isCorrect: false,
              comment: "Toucher la victime sans avoir sécurisé la zone peut être dangereux en cas de danger électrique."
          },
          {
              text: "Prendre des photos de la scène.",
              isCorrect: false,
              comment: "Prendre des photos de la scène peut être utile à des fins d'enquête ou de documentation, mais cela ne doit pas être la priorité lorsqu'une victime est en contact avec un conducteur endommagé."
          }
      ]
    },
    {
      "text": "Quelle est la première mesure recommandée pour traiter une gelure ?",
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
      text: "Quelle est la position la plus adaptée pour une personne victime d'un traumatisme de l'abdomen ?",
      "answers": [
          {
              text: "La position allongée, à plat dos, jambes fléchis.",
              isCorrect: true,
              comment: "Bonne réponse ! C'est en effet la position allongée, à plat dos, jambes fléchis"
          },
          {
              text: "La position demi-assise.",
              isCorrect: false,
              comment: "Mauvaise réponse. La bonne réponse est la position allongée, à plat dos, jambes fléchis"
          },
          {
              text: "La position debout.",
              isCorrect: true,
              comment: "Mauvaise réponse. La bonne réponse est la position allongée, à plat dos, jambes fléchis."
          },
          {
              text: "Pas de position particulière recommandée",
              isCorrect: false,
              comment: "Mauvaise réponse. La bonne réponse est la position allongée, à plat dos, jambes fléchis"
          }
      ]
    },
    {
      "text": "Quelle est la position la plus adaptée pour une personne victime d'un traumatisme du thorax ?",
      "answers": [
          {
              text: "La position allongée, à plat dos, jambes fléchis.",
              isCorrect: false,
              comment: "Bonne réponse ! C'est en effet la position demi-assise."
          },
          {
              text: "La position demi-assise.",
              isCorrect: true,
              comment: "Mauvaise réponse. Bonne réponse ! C'est en effet la position demi-assise."
          },
          {
              text: "La position debout.",
              isCorrect: true,
              comment: "Mauvaise réponse. Bonne réponse ! C'est en effet la position demi-assise."
          },
          {
              text: "Pas de position particulière recommandée",
              isCorrect: false,
              comment: "Mauvaise réponse. Bonne réponse ! C'est en effet la position demi-assise."
          }
      ]
    },
    {
      "text": "Quelle est la durée maximale recommandée pour rechercher la ventilation chez une victime inconsciente ?",
      "answers": [
          {
              text: "Dix secondes.",
              isCorrect: true,
              comment: "Effectivement, la recherche de la ventilation chez une victime inconsciente ne devrait pas dépasser dix secondes pour éviter tout retard dans la prise en charge."
          },
          {
              text: "Trente secondes.",
              isCorrect: false,
              comment: "Rechercher la ventilation chez une victime inconsciente ne devrait pas prendre plus de dix secondes pour éviter tout retard dans la prise en charge."
          },
          {
              text: "Une minute.",
              isCorrect: false,
              comment: "Une minute est une période trop longue pour rechercher la ventilation chez une victime inconsciente, car cela pourrait retarder la prise en charge."
          },
          {
              text: "Deux minutes.",
              isCorrect: false,
              comment: "Deux minutes est une période trop longue pour rechercher la ventilation chez une victime inconsciente, car cela pourrait retarder la prise en charge."
          }
      ]
    },
    
    {
      "text": "Quelle est la fréquence ventilatoire d'un Adulte ?",
      "answers": [
          {
              text: "12 à 20",
              isCorrect: true,
              comment: "Bonne réponse ! La fréquence ventilatoire d'un adulte est varie entre 12 et 20 mvt/min"
          },
          {
              text: "20 à 30",
              isCorrect: false,
              comment: "Mauvaise réponse! La fréquence ventilatoire d'un adulte est varie entre 12 et 20 mvt/min"
          },
          {
              text: "30 à 40.",
              isCorrect: false,
              comment: "Mauvaise réponse! La fréquence ventilatoire d'un adulte est varie entre 12 et 20 mvt/min"
          },
          {
              text: "60 à 100",
              isCorrect: false,
              comment: "Mauvaise réponse! La fréquence ventilatoire d'un adulte est varie entre 12 et 20 mvt/min"
          }
      ]
    },
    {
      "text": "Quelle est la fréquence ventilatoire d'un enfant ?",
      "answers": [
          {
              text: "12 à 20",
              isCorrect: false,
              comment: "Mauvaise réponse ! La fréquence ventilatoire d'un enfant varie entre 20 et 30 mvt/min"
          },
          {
              text: "20 à 30",
              isCorrect: true,
              comment: "Bonne réponse ! La fréquence ventilatoire d'un enfant varie entre 20 et 30 mvt/min"
          },
          {
              text: "30 à 40",
              isCorrect: false,
              comment: "Mauvaise réponse! La fréquence ventilatoire d'un enfant est varie entre 20 et 30 mvt/min"
          },
          {
              text: "60 à 100",
              isCorrect: false,
              comment: "Mauvaise réponse! La fréquence ventilatoire d'un enfant est varie entre 20 et 30 mvt/min"
          }
      ]
    },
    {
      "text": "Quelle est la fréquence ventilatoire d'un nourisson ?",
      "answers": [
          {
              text: "12 à 20",
              isCorrect: false,
              comment: "Mauvaise réponse ! La fréquence ventilatoire d'un nourisson varie entre 30 et 40 mvt/min"
          },
          {
              text: "20 à 30",
              isCorrect: false,
              comment: "Mauvaise réponse! La fréquence ventilatoire d'un nourisson varie entre 30 et 40 mvt/min"
          },
          {
              text: "30 à 40.",
              isCorrect: true,
              comment: "Bonne réponse ! La fréquence ventilatoire d'un nourisson varie entre 30 et 40 mvt/min"
          },
          {
              text: "60 à 100",
              isCorrect: false,
              comment: "Mauvaise réponse! La fréquence ventilatoire d'un enfant varie entre 30 et 40 mvt/min"
          }
      ]
    },
    {
      "text": "Quelle est la fréquence ventilatoire d'un nouveau-né ?",
      "answers": [
          {
              text: "12 à 20",
              isCorrect: false,
              comment: "Mauvaise réponse ! La fréquence ventilatoire d'un nouveau né varie entre 40 et 60 mvt/min"
          },
          {
              text: "20 à 30",
              isCorrect: false,
              comment: "Mauvaise réponse ! La fréquence ventilatoire d'un nouveau né varie entre 40 et 60 mvt/min"
          },
          {
              text: "30 à 40.",
              isCorrect: false,
              comment: "Mauvaise réponse ! La fréquence ventilatoire d'un nouveau né varie entre 40 et 60 mvt/min"
          },
          {
              text: "40 à 60",
              isCorrect: false,
              comment: "Bonne réponse ! La fréquence ventilatoire d'un nouveau né varie entre 40 et 60 mvt/min"
          }
      ]
    },
    {
      "text": "Quelle est la fréquence cardiaque d'un nouveau-né ?",
      "answers": [
          {
              text: "120 à 160",
              isCorrect: true,
              comment: "Bonne réponse ! La fréquence cardiaque d'un nouveau né varie entre 120 à 160 bpm"
          },
          {
              text: "20 à 30",
              isCorrect: false,
              comment: "Mauvaise réponse ! La fréquence cardiaque d'un nouveau né varie entre 120 à 160 bpm"
          },
          {
              text: "30 à 40.",
              isCorrect: false,
              comment: "Mauvaise réponse ! La fréquence cardiaque d'un nouveau né varie entre 120 à 160 bpm"
          },
          {
              text: "40 à 60",
              isCorrect: false,
              comment: "Mauvaise réponse ! La fréquence cardiaque d'un nouveau né varie entre 120 à 160 bpm"
          }
      ]
    },
    {
      "text": "Quand la mesure de la glycémie capillaire est-elle réalisée par les secouristes ?",
      "answers": [
          {
              text: "Devant toutes victimes présentant des signes évoquant un accident vasculaire cérébral.",
              isCorrect: false,
              comment: "La mesure de la glycémie capillaire n'est pas spécifiquement indiquée devant toutes les victimes présentant des signes évoquant un accident vasculaire cérébral."
          },
          {
              text: "Lorsqu'un médecin régulateur en fait la demande.",
              isCorrect: false,
              comment: "La demande d'un médecin régulateur n'est qu'une des indications pour la réalisation de la mesure de la glycémie capillaire, mais ce n'est pas la seule."
          },
          {
              text: "En présence de signes pouvant évoquer une hypoglycémie.",
              isCorrect: true,
              comment: "Oui, la mesure de la glycémie capillaire est réalisée en présence de signes pouvant évoquer une hypoglycémie, tels que des malaises chez un diabétique."
          },
          {
              text: "Uniquement en cas de perte de connaissance de la victime.",
              isCorrect: false,
              comment: "La mesure de la glycémie capillaire peut être réalisée dans diverses situations, pas seulement en cas de perte de connaissance de la victime."
          }
      ]
    },
    {
      "text": "Quels sont les éléments nécessaires à la réalisation de la mesure de la glycémie capillaire ?",
      "answers": [
          {
              text: "Un tensiomètre et un stéthoscope.",
              isCorrect: false,
              comment: "Un tensiomètre et un stéthoscope sont utilisés pour d'autres évaluations médicales, mais ils ne sont pas nécessaires à la mesure de la glycémie capillaire."
          },
          {
              text: "Un lecteur de glycémie et des bandelettes réactives.",
              isCorrect: true,
              comment: "Exact, pour réaliser la mesure de la glycémie capillaire, il faut un lecteur de glycémie et des bandelettes réactives adaptées."
          },
          {
              text: "Des compresses stériles et une seringue.",
              isCorrect: false,
              comment: "Les compresses stériles et les seringues sont utilisées pour d'autres procédures médicales et ne sont pas spécifiquement nécessaires à la mesure de la glycémie capillaire."
          },
          {
              text: "Un oxymètre de pouls et un tensiomètre automatique.",
              isCorrect: false,
              comment: "Ces équipements sont utilisés pour d'autres évaluations médicales, mais pas pour la mesure de la glycémie capillaire."
          }
      ]
    },
    {
      "text": "Quelle est la première étape à suivre avant de réaliser la mesure de la glycémie capillaire ?",
      "answers": [
          {
              text: "Frictionner les mains avec une solution hydroalcoolique.",
              isCorrect: false,
              comment: "Bien que le nettoyage des mains soit une étape importante, la première étape est d'installer la victime confortablement."
          },
          {
              text: "Expliquer le geste technique à la victime.",
              isCorrect: false,
              comment: "Expliquer le geste technique à la victime est une étape importante, mais ce n'est pas la première étape."
          },
          {
              text: "Se préparer en mettant des gants à usage unique.",
              isCorrect: false,
              comment: "Se préparer en mettant des gants à usage unique est une étape essentielle, mais ce n'est pas la première étape."
          },
          {
              text: "Installer la victime confortablement.",
              isCorrect: true,
              comment: "Oui, la première étape est d'installer la victime confortablement avant de procéder à la mesure de la glycémie capillaire."
          }
      ]
    },
    {
      "text": "Quelle est la dernière étape à suivre après avoir effectué la mesure de la glycémie capillaire ?",
      "answers": [
          {
              text: "Jeter les bandelettes réactives dans un sac à ordures ménagères.",
              isCorrect: false,
              comment: "Les bandelettes réactives doivent être jetées dans un sac à DASRI, pas dans un sac à ordures ménagères."
          },
          {
              text: "Éteindre le lecteur de glycémie après utilisation.",
              isCorrect: true,
              comment: "Exact, après avoir utilisé le lecteur de glycémie, il est important de l'éteindre pour économiser la batterie et prolonger sa durée de vie."
          },
          {
              text: "Transmettre le résultat de la glycémie à l'hôpital le plus proche.",
              isCorrect: false,
              comment: "Transmettre le résultat de la glycémie à un établissement de santé peut être nécessaire, mais ce n'est pas la dernière étape à suivre après avoir réalisé la mesure."
          },
          {
              text: "Se laver les mains avec du savon et de l'eau.",
              isCorrect: false,
              comment: "Se laver les mains est une étape importante pour l'hygiène, mais ce n'est pas la dernière étape après avoir effectué la mesure de la glycémie capillaire."
          }
      ]
    },
    {
      "text": "Quels sont les risques associés à la réalisation de la mesure de la glycémie capillaire ?",
      "answers": [
          {
              text: "La transmission d'une infection si les matériels ne sont pas correctement utilisés.",
              isCorrect: true,
              comment: "Oui, la transmission d'une infection est l'un des risques associés à la réalisation de la mesure de la glycémie capillaire si les matériels ne sont pas correctement utilisés."
          },
          {
              text: "La survenue d'une crise cardiaque chez la victime.",
              isCorrect: false,
              comment: "La réalisation de la mesure de la glycémie capillaire ne provoque pas directement la survenue d'une crise cardiaque chez la victime."
          },
          {
              text: "Une réaction allergique à la solution hydroalcoolique.",
              isCorrect: false,
              comment: "Une réaction allergique à la solution hydroalcoolique est possible, mais elle n'est pas spécifiquement liée à la réalisation de la mesure de la glycémie capillaire."
          },
          {
              text: "La perte de conscience de la victime pendant la mesure.",
              isCorrect: false,
              comment: "La perte de conscience de la victime pendant la mesure peut être une complication, mais ce n'est pas un risque directement associé à la réalisation de la mesure de la glycémie capillaire."
          }
      ]
    },
    {
      "text": "Quand la mesure de la pression artérielle est-elle réalisée ?",
      "answers": [
          {
              text: "Uniquement en situation d'urgence.",
              isCorrect: false,
              comment: "La mesure de la pression artérielle n'est pas réservée uniquement aux situations d'urgence, elle est réalisée chaque fois que possible, lors du bilan et de la surveillance."
          },
          {
              text: "À la demande du médecin régulateur.",
              isCorrect: false,
              comment: "La mesure de la pression artérielle peut être réalisée à la demande du médecin régulateur, mais elle n'est pas limitée à cette situation."
          },
          {
              text: "Lors du bilan et de la surveillance.",
              isCorrect: true,
              comment: "Oui, la mesure de la pression artérielle est réalisée lors du bilan et de la surveillance, chaque fois que possible."
          },
          {
              text: "Uniquement en cas de perte de connaissance de la victime.",
              isCorrect: false,
              comment: "La mesure de la pression artérielle peut être réalisée dans diverses situations, pas seulement en cas de perte de connaissance de la victime."
          }
      ]
    },
    {
      "text": "Quel matériel est nécessaire pour mesurer la pression artérielle ?",
      "answers": [
          {
              text: "Un tensiomètre et un stéthoscope.",
              isCorrect: true,
              comment: "Exact, pour mesurer la pression artérielle, un tensiomètre et un stéthoscope sont nécessaires, en fonction de la méthode de mesure utilisée."
          },
          {
              text: "Un lecteur de glycémie et des bandelettes réactives.",
              isCorrect: false,
              comment: "Ces équipements sont utilisés pour mesurer la glycémie, pas la pression artérielle."
          },
          {
              text: "Un oxymètre de pouls et un tensiomètre automatique.",
              isCorrect: false,
              comment: "Un oxymètre de pouls mesure la saturation en oxygène du sang, ce qui est différent de la mesure de la pression artérielle."
          },
          {
              text: "Une seringue et des compresses stériles.",
              isCorrect: false,
              comment: "Ces équipements sont utilisés pour d'autres procédures médicales, mais pas pour la mesure de la pression artérielle."
          }
      ]
    },
    {
      "text": "Quelle est la méthode recommandée pour mesurer la pression artérielle ?",
      "answers": [
          {
              text: "La mesure par auscultation.",
              isCorrect: true,
              comment: "Oui, la mesure par auscultation est l'une des méthodes recommandées pour mesurer la pression artérielle, notamment avec un tensiomètre manuel et un stéthoscope."
          },
          {
              text: "La mesure par palpation.",
              isCorrect: false,
              comment: "La mesure par palpation ne permet de mesurer que la pression systolique et n'est pas la méthode recommandée pour mesurer la pression artérielle dans toutes les situations."
          },
          {
              text: "La mesure automatique.",
              isCorrect: false,
              comment: "La mesure automatique est une autre méthode de mesure de la pression artérielle, mais ce n'est pas la méthode recommandée dans toutes les situations."
          },
          {
              text: "La mesure visuelle.",
              isCorrect: false,
              comment: "La mesure visuelle n'est pas une méthode standard pour mesurer la pression artérielle."
          }
      ]
    },
    {
      "text": "Quelle est la valeur normale de la pression artérielle chez l'adulte au repos ?",
      "answers": [
          {
              text: "100 mmHg de PA systolique et 80 mmHg de PA diastolique.",
              isCorrect: true,
              comment: "Exact, les valeurs normales de pression artérielle chez l'adulte au repos sont d'environ 100 mmHg de PA systolique et 80 mmHg de PA diastolique."
          },
          {
              text: "120 mmHg de PA systolique et 90 mmHg de PA diastolique.",
              isCorrect: false,
              comment: "Ces valeurs sont généralement considérées comme des valeurs de préhypertension chez l'adulte."
          },
          {
              text: "90 mmHg de PA systolique et 60 mmHg de PA diastolique.",
              isCorrect: false,
              comment: "Ces valeurs sont généralement considérées comme des valeurs de tension artérielle basse chez l'adulte."
          },
          {
              text: "140 mmHg de PA systolique et 100 mmHg de PA diastolique.",
              isCorrect: false,
              comment: "Ces valeurs sont généralement considérées comme des valeurs de préhypertension chez l'adulte."
          }
      ]
    },
    {
      "text": "Quels sont les risques associés à la mesure de la pression artérielle ?",
      "answers": [
          {
              text: "La sensation douloureuse lors du gonflement du brassard.",
              isCorrect: true,
              comment: "Oui, le gonflement du brassard peut entraîner une sensation douloureuse chez la victime."
          },
          {
              text: "La survenue d'une crise cardiaque chez la victime.",
              isCorrect: false,
              comment: "La mesure de la pression artérielle ne provoque pas directement la survenue d'une crise cardiaque chez la victime."
          },
          {
              text: "L'apparition d'une réaction allergique au brassard.",
              isCorrect: false,
              comment: "Une réaction allergique au brassard est possible mais rare."
          },
          {
              text: "L'impossibilité d'obtenir des résultats si la pression artérielle est trop basse ou trop élevée.",
              isCorrect: true,
              comment: "Oui, les dispositifs médicaux de mesure de la pression artérielle peuvent ne pas afficher de résultats si la pression artérielle est trop basse ou trop élevée."
          }
      ]
    },
    {
      "text": "Quand la mesure de la saturation pulsée en oxygène est-elle utile ?",
      "answers": [
          {
              text: "En cas de détresse vitale (sauf arrêt cardiorespiratoire).",
              isCorrect: true,
              comment: "Oui, la mesure de la saturation pulsée en oxygène est utile en cas de détresse vitale, sauf en cas d'arrêt cardiorespiratoire."
          },
          {
              text: "Uniquement en cas d'arrêt cardiorespiratoire.",
              isCorrect: false,
              comment: "La mesure de la saturation pulsée en oxygène est utile dans diverses situations de détresse respiratoire, pas seulement en cas d'arrêt cardiorespiratoire."
          },
          {
              text: "Uniquement en cas de blessure grave.",
              isCorrect: false,
              comment: "La mesure de la saturation pulsée en oxygène n'est pas limitée aux cas de blessures graves, mais elle peut être utile dans diverses situations de détresse respiratoire."
          },
          {
              text: "Uniquement en cas de choc traumatique.",
              isCorrect: false,
              comment: "La mesure de la saturation pulsée en oxygène n'est pas limitée aux cas de choc traumatique, mais elle peut être utile dans diverses situations de détresse respiratoire."
          }
      ]
    },
    {
      "text": "Quel est le matériel nécessaire pour mesurer la saturation pulsée en oxygène ?",
      "answers": [
          {
              text: "Un oxymètre de pouls et un capteur adapté à l'âge de la victime.",
              isCorrect: true,
              comment: "Exact, pour mesurer la saturation pulsée en oxygène, un oxymètre de pouls et un capteur adapté à l'âge de la victime sont nécessaires."
          },
          {
              text: "Un tensiomètre automatique.",
              isCorrect: false,
              comment: "Un tensiomètre automatique mesure la pression artérielle, pas la saturation pulsée en oxygène."
          },
          {
              text: "Un stéthoscope et un brassard.",
              isCorrect: false,
              comment: "Ces équipements sont utilisés pour d'autres mesures médicales, mais pas pour la saturation pulsée en oxygène."
          },
          {
              text: "Un thermomètre frontal.",
              isCorrect: false,
              comment: "Un thermomètre frontal est utilisé pour mesurer la température corporelle, pas la saturation pulsée en oxygène."
          }
      ]
    },
    {
      "text": "Quelles sont les valeurs normales de saturation pulsée en oxygène ?",
      "answers": [
          {
              text: "Entre 94 et 100 %.",
              isCorrect: true,
              comment: "Oui, les valeurs normales de saturation pulsée en oxygène se situent généralement entre 94 et 100 %."
          },
          {
              text: "Entre 80 et 90 %.",
              isCorrect: false,
              comment: "Ces valeurs indiquent une saturation pulsée en oxygène basse, ce qui peut être anormal dans de nombreuses situations."
          },
          {
              text: "Entre 70 et 80 %.",
              isCorrect: false,
              comment: "Ces valeurs indiquent une saturation pulsée en oxygène très basse, ce qui peut être dangereux pour la santé."
          },
          {
              text: "Entre 60 et 70 %.",
              isCorrect: false,
              comment: "Ces valeurs indiquent une saturation pulsée en oxygène très basse, ce qui peut être dangereux pour la santé."
          }
      ]
    },
    {
      "text": "Quels sont les risques associés à la mesure de la saturation pulsée en oxygène ?",
      "answers": [
          {
              text: "Le signal peut ne pas être détecté dans certaines situations.",
              isCorrect: true,
              comment: "Oui, dans certaines situations, le signal de l'oxymètre peut ne pas être détecté, ce qui peut fausser la mesure."
          },
          {
              text: "La fausse indication de valeurs rassurantes en cas d'intoxication au monoxyde de carbone.",
              isCorrect: true,
              comment: "Oui, l'intoxication au monoxyde de carbone peut fausser la mesure de la saturation pulsée en oxygène, en donnant à tort des valeurs rassurantes."
          },
          {
              text: "La sensation de brûlure au niveau du capteur.",
              isCorrect: false,
              comment: "La sensation de brûlure au niveau du capteur n'est pas un risque courant associé à la mesure de la saturation pulsée en oxygène."
          },
          {
              text: "La possibilité d'erreur lors de la mesure de la fréquence cardiaque.",
              isCorrect: false,
              comment: "La mesure de la fréquence cardiaque peut être affectée dans certaines situations, mais ce n'est pas un risque principal associé à la mesure de la saturation pulsée en oxygène."
          }
      ]
    },
    {
      "text": "Dans quelles situations la mesure manuelle de la fréquence cardiaque est-elle recommandée malgré l'affichage sur l'oxymètre ?",
      "answers": [
          {
              text: "En cas de détresse circulatoire.",
              isCorrect: true,
              comment: "Oui, en cas de détresse circulatoire, la mesure manuelle de la fréquence cardiaque est recommandée malgré l'affichage sur l'oxymètre, car la fréquence cardiaque peut être faussée dans cette situation."
          },
          {
              text: "Uniquement en cas d'arrêt cardiorespiratoire.",
              isCorrect: false,
              comment: "La mesure manuelle de la fréquence cardiaque peut être recommandée dans diverses situations, pas seulement en cas d'arrêt cardiorespiratoire."
          },
          {
              text: "Uniquement en cas de gêne respiratoire.",
              isCorrect: false,
              comment: "La mesure manuelle de la fréquence cardiaque peut être recommandée dans diverses situations, pas seulement en cas de gêne respiratoire."
          },
          {
              text: "En cas de tremblements de la victime.",
              isCorrect: false,
              comment: "Les tremblements de la victime peuvent affecter la mesure de la saturation pulsée en oxygène, mais ce n'est pas une indication directe pour une mesure manuelle de la fréquence cardiaque."
          }
      ]
    },
    
    {
      "text": "Quelle est la fréquence cardiaque d'un adulte ?",
      "answers": [
          {
              text: "60 à 100",
              isCorrect: true,
              comment: "Bonne réponse ! La fréquence cardiaque d'un adulte varie entre 60 à 100 bpm."
          },
          {
              text: "70 à 140",
              isCorrect: false,
              comment: "Mauvaise réponse ! La fréquence cardiaque d'un adulte varie entre 60 à 100 bpm."
          },
          {
              text: "100 à 160",
              isCorrect: false,
              comment: "Mauvaise réponse ! La fréquence cardiaque d'un adulte varie entre 60 à 100 bpm."
          },
          {
              text: "40 à 60",
              isCorrect: false,
              comment: "Mauvaise réponse ! La fréquence cardiaque d'un adulte varie entre 60 à 100 bpm."
          }
      ]
    },
    {
      "text": "Quelle est la fréquence cardiaque d'un enfant ?",
      "answers": [
          {
              text: "60 à 100",
              isCorrect: false,
              comment: "Mauvaise réponse ! La fréquence cardiaque d'un enfant varie entre 70 à 140 bpm."
          },
          {
              text: "70 à 140",
              isCorrect: true,
              comment: "Mauvaise réponse ! La fréquence cardiaque d'un enfant varie entre 70 à 140 bpm."
          },
          {
              text: "100 à 160.",
              isCorrect: false,
              comment: "Mauvaise réponse ! La fréquence cardiaque d'un enfant varie entre 70 à 140 bpm."
          },
          {
              text: "40 à 60",
              isCorrect: false,
              comment: "Mauvaise réponse ! La fréquence cardiaque d'un enfant varie entre 70 à 140 bpm."
          }
    
    
    
      ]
    },
    {
      "text": "Quel est le principal objectif de la mesure de la température d'une victime ?",
      "answers": [
          {
              "text": "Dépister une augmentation ou une diminution de la température corporelle.",
              "isCorrect": true,
              "comment": "Oui, la mesure de la température d'une victime vise principalement à dépister une augmentation (hyperthermie) ou une diminution (hypothermie) de sa température corporelle."
          },
          {
              "text": "Déterminer la fréquence respiratoire.",
              "isCorrect": false,
              "comment": "La mesure de la température ne vise pas à déterminer la fréquence respiratoire, mais plutôt à évaluer la température corporelle de la victime."
          },
          {
              "text": "Évaluer la pression artérielle.",
              "isCorrect": false,
              "comment": "La mesure de la température ne vise pas à évaluer la pression artérielle, mais plutôt à évaluer la température corporelle de la victime."
          },
          {
              "text": "Déterminer le taux de glycémie.",
              "isCorrect": false,
              "comment": "La mesure de la température ne vise pas à déterminer le taux de glycémie, mais plutôt à évaluer la température corporelle de la victime."
          }
      ]
    },
    {
      "text": "Quels sont les types de thermomètres utilisables pour mesurer la température ?",
      "answers": [
          {
              "text": "Thermomètre tympanique, thermomètre électronique, thermomètre médical et thermomètre frontal.",
              "isCorrect": true,
              "comment": "Oui, ces différents types de thermomètres peuvent être utilisés pour mesurer la température corporelle de la victime."
          },
          {
              "text": "Spiromètre et tensiomètre.",
              "isCorrect": false,
              "comment": "Le spiromètre est utilisé pour mesurer la capacité pulmonaire, et le tensiomètre est utilisé pour mesurer la pression artérielle, mais ni l'un ni l'autre n'est utilisé pour mesurer la température corporelle."
          },
          {
              "text": "Stéthoscope et oxymètre de pouls.",
              "isCorrect": false,
              "comment": "Le stéthoscope est utilisé pour écouter les sons du corps, et l'oxymètre de pouls est utilisé pour mesurer la saturation pulsée en oxygène, mais ni l'un ni l'autre n'est utilisé pour mesurer la température corporelle."
          },
          {
              "text": "Tensiomètre et glucomètre.",
              "isCorrect": false,
              "comment": "Le tensiomètre est utilisé pour mesurer la pression artérielle, et le glucomètre est utilisé pour mesurer le taux de glycémie, mais ni l'un ni l'autre n'est utilisé pour mesurer la température corporelle."
          }
      ]
    },
    {
      "text": "Quel est le type de thermomètre recommandé pour la mesure de la température chez un nourrisson de moins de 3 mois ?",
      "answers": [
          {
              "text": "Thermomètre rectal.",
              "isCorrect": true,
              "comment": "Oui, le thermomètre rectal est recommandé pour mesurer la température chez un nourrisson de moins de 3 mois, car son conduit auditif est trop petit pour utiliser un thermomètre auriculaire."
          },
          {
              "text": "Thermomètre buccal.",
              "isCorrect": false,
              "comment": "Le thermomètre buccal n'est pas recommandé pour mesurer la température chez un nourrisson de moins de 3 mois, car il peut être difficile de l'utiliser avec précision à cet âge."
          },
          {
              "text": "Thermomètre auriculaire.",
              "isCorrect": false,
              "comment": "Le thermomètre auriculaire n'est pas recommandé pour mesurer la température chez un nourrisson de moins de 3 mois, car son conduit auditif est trop petit pour utiliser ce type de thermomètre."
          },
          {
              "text": "Thermomètre frontal.",
              "isCorrect": false,
              "comment": "Le thermomètre frontal n'est pas recommandé pour mesurer la température chez un nourrisson de moins de 3 mois, car il peut ne pas être aussi précis que d'autres types de thermomètres."
          }
      ]
    },
    {
      "text": "Quelle est la température normale du corps humain chez un adulte au repos et réveillé ?",
      "answers": [
          {
              "text": "Autour de 37°C.",
              "isCorrect": true,
              "comment": "Oui, la température normale du corps humain chez un adulte au repos et réveillé est d'environ 37°C."
          },
          {
              "text": "Autour de 35°C.",
              "isCorrect": false,
              "comment": "Une température autour de 35°C indiquerait une hypothermie légère chez un adulte au repos et réveillé, ce qui n'est pas considéré comme normal."
          },
          {
              "text": "Autour de 40°C.",
              "isCorrect": false,
              "comment": "Une température autour de 40°C indiquerait une fièvre chez un adulte au repos et réveillé, ce qui n'est pas considéré comme normal."
          },
          {
              "text": "Autour de 42°C.",
              "isCorrect": false,
              "comment": "Une température autour de 42°C serait considérée comme une hyperthermie sévère chez un adulte au repos et réveillé, ce qui n'est pas considéré comme normal."
          }
      ]
    },{
        "text": "Quels sont les principaux objectifs de la transmission du bilan selon les informations fournies ?",
        "answers": [
            {
                text: "Demander un avis médical, demander du renfort, définir l’orientation de la victime et réaliser un relai.",
                isCorrect: true,
                comment: "Effectivement, la transmission du bilan vise à accomplir ces objectifs selon les informations fournies."
            },
            {
                text: "Réaliser un examen détaillé de la victime et mesurer les paramètres physiologiques.",
                isCorrect: false,
                comment: "Non, la transmission du bilan concerne la communication des informations sur l'intervention et l'état de la victime, pas la réalisation d'un examen détaillé ou la mesure des paramètres physiologiques."
            },
            {
                text: "Assurer la sécurité des intervenants et de la victime.",
                isCorrect: false,
                comment: "Ce n'est pas le but principal de la transmission du bilan, même si cela peut en découler indirectement."
            },
            {
                text: "Donner des instructions spécifiques sur les gestes de secours à entreprendre.",
                isCorrect: false,
                comment: "La transmission du bilan vise à communiquer des informations sur l'intervention déjà entreprise, pas à donner des instructions spécifiques sur les gestes de secours à entreprendre."
            }
        ]
    },
    {
        "text": "Que doit contenir la transmission du bilan pour une situation nécessitant immédiatement des moyens en renfort ?",
        "answers": [
            {
                text: "La nature de l’intervention, les moyens déjà présents sur place, les moyens supplémentaires nécessaires et éventuellement la correction d'informations erronées.",
                isCorrect: true,
                comment: "Oui, dans une situation nécessitant des moyens en renfort, la transmission du bilan doit inclure ces éléments selon les informations fournies."
            },
            {
                text: "Un compte-rendu détaillé de l'ensemble de l'intervention.",
                isCorrect: false,
                comment: "Non, dans une situation nécessitant des moyens en renfort, la transmission du bilan doit être particulièrement descriptive de la situation, mais elle ne nécessite pas nécessairement un compte-rendu détaillé de l'ensemble de l'intervention."
            },
            {
                text: "Les antécédents médicaux complets de la victime.",
                isCorrect: false,
                comment: "La transmission du bilan ne nécessite pas les antécédents médicaux complets de la victime, mais plutôt des informations spécifiques liées à la situation actuelle."
            },
            {
                text: "Des recommandations sur les gestes de secours à entreprendre.",
                isCorrect: false,
                comment: "La transmission du bilan ne se concentre pas sur les recommandations futures, mais sur la communication des informations pertinentes pour la situation actuelle."
            }
        ]
    },
    {
        "text": "Que doit inclure la transmission du bilan pour une victime ne présentant pas de détresse vitale ?",
        "answers": [
            {
                text: "Le motif réel de l’intervention, le sexe et l’âge de la victime, la plainte principale, le résultat du bilan et les gestes de secours entrepris.",
                isCorrect: true,
                comment: "Oui, dans ce cas, la transmission du bilan doit inclure ces éléments spécifiques selon les informations fournies."
            },
            {
                text: "Un appel à une équipe de renfort médical.",
                isCorrect: false,
                comment: "Cela ne fait pas partie des éléments nécessaires pour la transmission du bilan dans ce contexte."
            },
            {
                text: "Des détails sur les antécédents médicaux complets de la victime.",
                isCorrect: false,
                comment: "La transmission du bilan ne nécessite pas les antécédents médicaux complets de la victime, mais plutôt des informations spécifiques liées à la situation actuelle."
            },
            {
                text: "Les instructions spécifiques sur les gestes de secours à entreprendre pour la suite de l'intervention.",
                isCorrect: false,
                comment: "La transmission du bilan se concentre sur la communication des informations pertinentes pour la situation actuelle, pas sur les instructions futures."
            }
        ]
    },
    {
      "text": "Comment épelle-t-on LAMPADAIRE en alphabet OTAN ?",
      "answers": [
          {
              text: "Lima Alpha Mike Papa Alpha Delta Alpha India Romeo Echo ",
              isCorrect: true,
              comment: "Bien joué !"
          },
          {
              text: "Lime Alpha Mike Papa Alpha Delta Alpha India Romeo Echo",
              isCorrect: false,
              comment: "Non, c'était Lima Alpha Mike Papa Alpha Delta Alpha India Romeo Echo."
          },
          {
              text: "Linge Arbre Mire Parcours Arbitre Deltaplane Arbitre India Romeo Echo",
              isCorrect: false,
              comment: "Non, c'était Lima Alpha Mike Papa Alpha Delta Alpha India Romeo Echo"
          },
          {
              text: "Linge Arbre Mire Papa Alpha Delta Alpha India Romeo Echo",
              isCorrect: false,
              comment: "Non, c'était Linge Arbre Mire"
          }
      ]
    },
    {
      "text": "Comment épelle-t-on SECOURISTE en alphabet OTAN ?",
      "answers": [
          {
              text: "Sierra Echo Charly Oscar Uniform Romeo India Sierra Tango Echo",
              isCorrect: true,
              comment: "Bien joué !"
          },
          {
              text: "Sierra Echo Charly Oscar Uniform Romeo India Sierra Terrien Echo",
              isCorrect: false,
              comment: "Non, c'était Sierra Echo Charly Oscar Uniform Romeo India Sierra Tango Echo."
          },
          {
              text: "Sierra Echo Charly Orion Uniform Romeo India Sierra Tango Echo",
              isCorrect: false,
              comment: "Non, c'était Sierra Echo Charly Oscar Uniform Romeo India Sierra Tango Echo"
          },
          {
              text: "Sierra Ecole Charly Oscar Uniform Romeo India Sierra Tango Ecole",
              isCorrect: false,
              comment: "Non, c'était Sierra Echo Charly Oscar Uniform Romeo India Sierra Tango Echo"
          }
      ]
    },{
        "text": "Quel équipement est recommandé pour se protéger du risque de contamination par des liquides biologiques lors d'une intervention ?",
        "answers": [
            {
                "text": "Une paire de gants à usage unique.",
                "isCorrect": true,
                "comment": "Effectivement, une paire de gants à usage unique est recommandée pour se protéger du risque de contamination par des liquides biologiques lors d'une intervention, car elle constitue une barrière efficace."
            },
            {
                "text": "Un blouson adapté aux conditions climatiques.",
                "isCorrect": false,
                "comment": "Le port d'un blouson adapté aux conditions climatiques est important pour le confort de l'intervenant, mais il ne protège pas spécifiquement contre le risque de contamination par des liquides biologiques."
            },
            {
                "text": "Une lampe de poche ou frontale.",
                "isCorrect": false,
                "comment": "La lampe de poche ou frontale est utile pour travailler en sécurité dans l'obscurité, mais elle ne protège pas contre le risque de contamination par des liquides biologiques."
            },
            {
                "text": "Des bandes réfléchissantes sur les vêtements.",
                "isCorrect": false,
                "comment": "Les bandes réfléchissantes sur les vêtements améliorent la visibilité du secouriste, mais elles ne sont pas spécifiquement conçues pour protéger contre le risque de contamination par des liquides biologiques."
            }
        ]
    },
    {
        "text": "Que doit faire l'intervenant en présence de débris de verre ou autres objets perforants lors d'une intervention ?",
        "answers": [
            {
                "text": "Mettre des gants épais de manutention et veiller à ne pas se blesser ou à ne pas blesser accidentellement un tiers.",
                "isCorrect": true,
                "comment": "Effectivement, en présence de débris de verre ou autres objets perforants, l'intervenant doit mettre des gants épais de manutention et veiller à ne pas se blesser ou à ne pas blesser accidentellement un tiers pour se protéger contre les risques de blessures."
            },
            {
                "text": "Utiliser une méthode orale directe de ventilation artificielle.",
                "isCorrect": false,
                "comment": "L'utilisation d'une méthode orale directe de ventilation artificielle n'est pas recommandée en présence de débris de verre ou autres objets perforants, car cela peut augmenter le risque de blessures ou de contamination."
            },
            {
                "text": "Déposer les objets tranchants dans les boîtes de recueil des déchets d'activités de soins.",
                "isCorrect": false,
                "comment": "Bien que le dépôt des objets tranchants dans les boîtes de recueil des déchets d'activités de soins soit une mesure importante, cela ne suffit pas à protéger l'intervenant contre les risques de blessures lors de leur manipulation."
            },
            {
                "text": "Appliquer les précautions standards et particulières pour lutter contre les infections.",
                "isCorrect": false,
                "comment": "L'application des précautions standards et particulières pour lutter contre les infections est une mesure générale de protection, mais elle ne constitue pas une réponse spécifique en présence de débris de verre ou autres objets perforants."
            }
        ]
    },
    {
        "text": "Quel est l'objectif des techniques de protection utilisables par les intervenants lors d'une prise en charge de victime ?",
        "answers": [
            {
                "text": "Interrompre la transmission d'un germe d'un individu à l'autre et limiter le risque de transmission d'un germe dangereux aux secouristes.",
                "isCorrect": true,
                "comment": "Effectivement, l'objectif des techniques de protection utilisables par les intervenants est d'interrompre la transmission d'un germe d'un individu à l'autre et de limiter le risque de transmission d'un germe dangereux aux secouristes pour prévenir les infections."
            },
            {
                "text": "Réduire le temps d'intervention sur le lieu de l'accident.",
                "isCorrect": false,
                "comment": "La réduction du temps d'intervention sur le lieu de l'accident est importante pour la prise en charge rapide des victimes, mais ce n'est pas l'objectif principal des techniques de protection."
            },
            {
                "text": "Minimiser les coûts liés à la protection individuelle.",
                "isCorrect": false,
                "comment": "La minimisation des coûts liés à la protection individuelle peut être un élément à prendre en compte, mais cela ne constitue pas l'objectif principal des techniques de protection utilisables par les intervenants."
            },
            {
                "text": "Éviter les contraintes de port d'équipements lourds.",
                "isCorrect": false,
                "comment": "Éviter les contraintes de port d'équipements lourds peut être un avantage, mais cela ne constitue pas l'objectif principal des techniques de protection utilisables par les intervenants."
            }
        ]
    },
    {
        "text": "Pourquoi est-il recommandé d'éviter l'utilisation d'une méthode orale directe de ventilation artificielle en cas de disponibilité d'un moyen de ventilation lors des manœuvres de réanimation ?",
        "answers": [
            {
                "text": "Même si le risque de transmission par la salive est très faible, il faut éviter d'utiliser une méthode orale directe de ventilation artificielle pour limiter les contacts directs entre le secouriste et la victime.",
                "isCorrect": true,
                "comment": "Effectivement, même si le risque de transmission par la salive est très faible, il est recommandé d'éviter d'utiliser une méthode orale directe de ventilation artificielle pour limiter les contacts directs entre le secouriste et la victime, surtout si un moyen de ventilation est disponible."
            },
            {
                "text": "La méthode orale directe de ventilation artificielle est plus efficace que l'utilisation d'un moyen de ventilation.",
                "isCorrect": false,
                "comment": "La méthode orale directe de ventilation artificielle n'est pas nécessairement plus efficace que l'utilisation d'un moyen de ventilation, surtout si les conditions le permettent."
            },
            {
                "text": "L'utilisation d'une méthode orale directe de ventilation artificielle permet de réduire la fatigue du secouriste.",
                "isCorrect": false,
                "comment": "La réduction de la fatigue du secouriste peut être un avantage de l'utilisation d'une méthode orale directe de ventilation artificielle, mais ce n'est pas la principale raison pour éviter son utilisation en cas de disponibilité d'un moyen de ventilation."
            },
            {
                "text": "La méthode orale directe de ventilation artificielle est plus rapide à mettre en œuvre que l'utilisation d'un moyen de ventilation.",
                "isCorrect": false,
                "comment": "La rapidité de mise en œuvre n'est pas le principal critère pour choisir entre la méthode orale directe de ventilation artificielle et l'utilisation d'un moyen de ventilation lors des manœuvres de réanimation."
            }
        ]
    },
    {
        "text": "Quelle est la première étape recommandée pour assurer la sécurité sur le lieu d'intervention ?",
        "answers": [
            {
                "text": "Effectuer une approche prudente de la zone de l’accident afin d’évaluer les dangers potentiels pour les intervenants et les témoins.",
                "isCorrect": true,
                "comment": "Effectivement, la première étape recommandée pour assurer la sécurité sur le lieu d'intervention est d'effectuer une approche prudente de la zone de l’accident afin d’évaluer les dangers potentiels pour les intervenants et les témoins."
            },
            {
                "text": "Mettre en place les moyens de protection collective en dotation.",
                "isCorrect": false,
                "comment": "Mettre en place les moyens de protection collective en dotation est une étape ultérieure dans le processus de sécurisation du lieu d'intervention, mais ce n'est pas la première étape recommandée."
            },
            {
                "text": "Repérer les personnes exposées aux dangers et leur demander de quitter la zone d'intervention.",
                "isCorrect": false,
                "comment": "Bien que repérer les personnes exposées aux dangers soit important, cela ne constitue pas la première étape recommandée pour assurer la sécurité sur le lieu d'intervention."
            },
            {
                "text": "Réaliser un dégagement d'urgence de la victime en cas de danger imminent.",
                "isCorrect": false,
                "comment": "Réaliser un dégagement d'urgence de la victime en cas de danger imminent est une mesure spécifique qui peut être prise dans certaines situations, mais ce n'est pas la première étape recommandée pour assurer la sécurité sur le lieu d'intervention."
            }
        ]
    },
    {
        "text": "Quelle action les intervenants doivent-ils réaliser en cas d'impossibilité ou de danger réel et imminent pour la victime ?",
        "answers": [
            {
                "text": "Réaliser un dégagement d’urgence.",
                "isCorrect": true,
                "comment": "Effectivement, en cas d'impossibilité ou de danger réel et imminent pour la victime, les intervenants doivent réaliser un dégagement d’urgence pour la mettre en sécurité."
            },
            {
                "text": "Mettre en place les moyens de protection collective en dotation.",
                "isCorrect": false,
                "comment": "Mettre en place les moyens de protection collective en dotation est une mesure importante, mais ce n'est pas la réponse appropriée en cas d'impossibilité ou de danger réel et imminent pour la victime."
            },
            {
                "text": "Délimiter clairement la zone d’intervention et empêcher toute intrusion.",
                "isCorrect": false,
                "comment": "Délimiter clairement la zone d’intervention et empêcher toute intrusion est une mesure générale de sécurité, mais ce n'est pas la réponse appropriée en cas d'impossibilité ou de danger réel et imminent pour la victime."
            },
            {
                "text": "Repérer les personnes exposées aux dangers et leur demander de quitter la zone d'intervention.",
                "isCorrect": false,
                "comment": "Repérer les personnes exposées aux dangers et leur demander de quitter la zone d'intervention est une mesure importante, mais ce n'est pas la réponse appropriée en cas d'impossibilité ou de danger réel et imminent pour la victime."
            }
        ]
    },
    {
        "text": "Comment les intervenants doivent-ils réagir si une personne extérieure peut apporter une aide dans la mise en œuvre de la protection sur le lieu d'intervention ?",
        "answers": [
            {
                "text": "Ils doivent utiliser tous les moyens matériels dont ils peuvent disposer et s’assurer si besoin du concours de toute autre personne qui pourrait apporter une aide dans la mise en œuvre de cette protection.",
                "isCorrect": true,
                "comment": "Effectivement, les intervenants doivent utiliser tous les moyens matériels dont ils peuvent disposer et s’assurer si besoin du concours de toute autre personne qui pourrait apporter une aide dans la mise en œuvre de cette protection, afin d'optimiser la sécurité sur le lieu d'intervention."
            },
            {
                "text": "Ils doivent se concentrer uniquement sur les moyens de protection collective en dotation.",
                "isCorrect": false,
                "comment": "Se concentrer uniquement sur les moyens de protection collective en dotation peut limiter les possibilités d'optimiser la sécurité sur le lieu d'intervention en n'utilisant pas toutes les ressources disponibles."
            },
            {
                "text": "Ils doivent demander l'assistance du service de sécurité publique le plus proche.",
                "isCorrect": false,
                "comment": "Demander l'assistance du service de sécurité publique le plus proche peut être une mesure appropriée dans certaines situations, mais ce n'est pas nécessairement la réponse la plus efficace pour obtenir une aide immédiate dans la mise en œuvre de la protection sur le lieu d'intervention."
            },
            {
                "text": "Ils doivent attendre les instructions du médecin régulateur avant d'agir.",
                "isCorrect": false,
                "comment": "Attendre les instructions du médecin régulateur peut entraîner des retards dans la mise en œuvre des mesures de protection, ce qui peut compromettre la sécurité sur le lieu d'intervention."
            }
        ]
    },
    {
        "text": "Que faut-il faire si une personne est en contact avec un appareil électrique lors d'un accident électrique ?",
        "answers": [
            
            {
                "text": "S'approcher de la victime immédiatement et la toucher pour évaluer ses blessures.",
                "isCorrect": false,
                "comment": "S'approcher de la victime immédiatement et la toucher sans avoir coupé le courant ou débranché l'appareil peut aggraver la situation en augmentant le risque de choc électrique."
            },
            {
                "text": "Utiliser un extincteur pour éteindre les flammes si la victime est en feu.",
                "isCorrect": false,
                "comment": "Utiliser un extincteur pour éteindre les flammes n'est pas approprié en cas d'accident électrique, car cela peut aggraver les blessures de la victime en augmentant le risque de choc électrique."
            },
      {
                "text": "Couper le courant (disjoncteur) ou débrancher l'appareil en cause avant de s'approcher ou de toucher la victime.",
                "isCorrect": true,
                "comment": "Effectivement, en cas d'accident électrique, il est essentiel de couper le courant ou de débrancher l'appareil en cause avant de s'approcher ou de toucher la victime pour éviter tout risque supplémentaire."
            },
            {
                "text": "Attendre l'arrivée des équipes spécialisées pour intervenir.",
                "isCorrect": false,
                "comment": "Attendre l'arrivée des équipes spécialisées peut prendre du temps, et dans une situation d'urgence, chaque instant compte pour assurer la sécurité de la victime."
            }
        ]
    },
    {
        "text": "Quelle est la première action à entreprendre pour se protéger lors d'un accident de la route en tant qu'intervenant ?",
        "answers": [
            
            {
                "text": "Sortir immédiatement du véhicule pour porter assistance aux victimes.",
                "isCorrect": false,
                "comment": "Sortir immédiatement du véhicule sans prendre les mesures de sécurité appropriées peut augmenter les risques pour l'intervenant et les autres usagers de la route."
            },
            {
                "text": "Se garer devant le lieu de l'accident pour faciliter l'accès aux victimes.",
                "isCorrect": false,
                "comment": "Se garer devant le lieu de l'accident peut entraver la circulation et aggraver la situation en créant un obstacle pour les secours et les autres usagers de la route."
            },
            {
                "text": "Mettre un gilet de sécurité haute visibilité avant de quitter le véhicule.",
                "isCorrect": false,
                "comment": "Mettre un gilet de sécurité haute visibilité est une mesure importante, mais ce n'est pas la première action à entreprendre pour se protéger lors d'un accident de la route en tant qu'intervenant."
            },
      {
                "text": "Allumer les feux de détresse du véhicule et ralentir en approchant du lieu de l'accident.",
                "isCorrect": true,
                "comment": "Effectivement, la première action à entreprendre pour se protéger lors d'un accident de la route en tant qu'intervenant est d'allumer les feux de détresse du véhicule et de ralentir en approchant du lieu de l'accident pour signaler sa présence aux autres usagers de la route."
            },
        ]
    },
    {
        "text": "Que doit faire un intervenant en cas de fuite de gaz suspectée dans un local ?",
        "answers": [
            {
                "text": "Ne pas pénétrer dans le local, rester à distance, empêcher l'accès, et ne pas provoquer d'étincelles.",
                "isCorrect": true,
                "comment": "Effectivement, en cas de fuite de gaz suspectée dans un local, il est important de ne pas pénétrer dans le local, de rester à distance, d'empêcher l'accès, et de ne pas provoquer d'étincelles pour éviter tout risque d'explosion ou d'incendie."
            },
            {
                "text": "Pénétrer dans le local pour évaluer l'ampleur de la fuite et arrêter la source de gaz.",
                "isCorrect": false,
                "comment": "Pénétrer dans le local sans équipement de protection adéquat peut mettre l'intervenant en danger et aggraver la situation en cas de fuite de gaz."
            },
            {
                "text": "Allumer une lampe de poche pour éclairer le local et rechercher la source de la fuite.",
                "isCorrect": false,
                "comment": "Allumer une lampe de poche peut provoquer des étincelles et aggraver la situation en cas de fuite de gaz."
            },
            {
                "text": "Contacter les sapeurs-pompiers et leur indiquer la présence d'une fuite de gaz.",
                "isCorrect": false,
                "comment": "Contacter les sapeurs-pompiers est une mesure importante, mais ce n'est pas la seule action à entreprendre en cas de fuite de gaz suspectée dans un local."
            }
        ]
    },
    {
        "text": "Que doit faire un intervenant en présence d'une victime dont les vêtements sont en feu ?",
        "answers": [
            
            {
                "text": "S'éloigner de la victime pour éviter toute blessure due aux flammes.",
                "isCorrect": false,
                "comment": "S'éloigner de la victime sans lui porter secours peut aggraver ses blessures et compromettre sa survie en cas d'incendie."
            },
            {
                "text": "Utiliser de l'eau pour éteindre les flammes sur la victime.",
                "isCorrect": false,
                "comment": "Utiliser de l'eau pour éteindre les flammes sur la victime peut aggraver ses blessures en augmentant la propagation du feu et en causant des brûlures par la chaleur de l'eau."
            },
    {
                "text": "Allonger la victime sur le sol et éteindre les flammes avec un extincteur approprié (couleur verte) si disponible, sinon utiliser une couverture ou un manteau pour éteindre les flammes.",
                "isCorrect": true,
                "comment": "Effectivement, en présence d'une victime dont les vêtements sont en feu, il est important d'allonger la victime sur le sol et d'éteindre les flammes avec un extincteur approprié si disponible, sinon d'utiliser une couverture ou un manteau pour éteindre les flammes."
            },
            {
                "text": "Demander aux témoins de verser du sable sur la victime pour éteindre les flammes.",
                "isCorrect": false,
                "comment": "Demander aux témoins de verser du sable sur la victime peut retarder les secours et aggraver les blessures en cas d'incendie."
            }
        ]
    },
    {
        "text": "Que doit faire un intervenant pour se protéger lors d'une fuite de substances dangereuses ?",
        "answers": [
            
            {
                "text": "Pénétrer dans la zone contaminée pour évaluer l'ampleur de la fuite et arrêter la source du déversement.",
                "isCorrect": false,
                "comment": "Pénétrer dans la zone contaminée peut mettre l'intervenant en danger et aggraver la situation en cas de fuite de substances dangereuses."
            },
    {
                "text": "Rester à distance de la fuite, écarter les témoins de la scène, ne pas provoquer d'étincelles, et alerter immédiatement les sapeurs-pompiers.",
                "isCorrect": true,
                "comment": "Effectivement, lors d'une fuite de substances dangereuses, il est essentiel de rester à distance de la fuite, d'écarter les témoins de la scène, de ne pas provoquer d'étincelles, et d'alerter immédiatement les sapeurs-pompiers pour obtenir une assistance spécialisée."
            },
            {
                "text": "Éteindre les flammes si la fuite de substances dangereuses est accompagnée d'un incendie.",
                "isCorrect": false,
                "comment": "Éteindre les flammes peut être dangereux si la fuite de substances dangereuses est inflammable et augmenter le risque d'explosion."
            },
            {
                "text": "Attendre que les secours arrivent sur place avant d'intervenir.",
                "isCorrect": false,
                "comment": "Attendre que les secours arrivent sur place peut retarder la prise de mesures d'urgence et aggraver les conséquences de la fuite de substances dangereuses."
            }
        ]
    },
    {
        text: "Combien de techniques de dégagement d'urgence sont décrites dans les recommandations pour soustraire une victime à un danger réel et vital ?",
        answers: [
            {
                text: "Trois",
                isCorrect: true,
                comment: "Effectivement, trois techniques de dégagement d'urgence sont décrites pour soustraire une victime à un danger réel et vital : traction par les chevilles, traction par les poignets, et traction par les vêtements."
            },
            {
                text: "Cinq",
                isCorrect: false,
                comment: "Il y a en réalité trois techniques de dégagement d'urgence décrites pour soustraire une victime à un danger réel et vital."
            },
            {
                text: "Quatre",
                isCorrect: false,
                comment: "Il y a en réalité trois techniques de dégagement d'urgence décrites pour soustraire une victime à un danger réel et vital."
            },
            {
                text: "Deux",
                isCorrect: false,
                comment: "Il y a en réalité trois techniques de dégagement d'urgence décrites pour soustraire une victime à un danger réel et vital."
            }
        ]
    },
    {
        text: "Quelle est la principale justification du dégagement d'urgence d'une victime ?",
        answers: [
            {
                text: "Assurer la sécurité des secouristes.",
                isCorrect: false,
                comment: "Assurer la sécurité des secouristes est un objectif important mais ce n'est pas la principale justification du dégagement d'urgence."
            },
            {
                text: "Permettre de réaliser en toute sécurité le bilan et les gestes de secours d'urgence sur la victime.",
                isCorrect: true,
                comment: "Effectivement, la principale justification du dégagement d'urgence est de permettre de déplacer rapidement la victime vers un lieu sûr où les gestes de secours peuvent être réalisés en toute sécurité."
            },
            {
                text: "Éviter tout risque de suraccident.",
                isCorrect: false,
                comment: "Éviter tout risque de suraccident est un objectif du dégagement d'urgence mais ce n'est pas sa principale justification."
            },
            {
                text: "S'assurer que la victime n'est pas en contact avec des objets tranchants.",
                isCorrect: false,
                comment: "S'assurer que la victime n'est pas en contact avec des objets tranchants est une mesure importante mais ce n'est pas la principale justification du dégagement d'urgence."
            }
        ]
    },
    {
        text: "Quelles sont les actions à entreprendre lors du dégagement d'urgence d'une victime en traction par les poignets ?",
        answers: [
            {
                text: "Saisir la victime par les poignets et la tirer sur le sol jusqu'à ce qu'elle soit en lieu sûr.",
                isCorrect: true,
                comment: "Effectivement, lors du dégagement d'urgence d'une victime en traction par les poignets, l'intervenant doit saisir la victime par les poignets et la tirer sur le sol jusqu'à ce qu'elle soit en lieu sûr."
            },
            {
                text: "Saisir la victime par les chevilles et la tirer sur le sol jusqu'à ce qu'elle soit en lieu sûr.",
                isCorrect: false,
                comment: "Saisir la victime par les chevilles correspond à une autre technique de dégagement d'urgence, pas à la traction par les poignets."
            },
            {
                text: "Saisir la victime par les vêtements et la tirer sur le sol jusqu'à ce qu'elle soit en lieu sûr.",
                isCorrect: false,
                comment: "Saisir la victime par les vêtements correspond à une autre technique de dégagement d'urgence, pas à la traction par les poignets."
            },
            {
                text: "Saisir la victime par ses chevilles et poignets et la tirer sur le sol jusqu'à ce qu'elle soit en lieu sûr.",
                isCorrect: false,
                comment: "Saisir la victime par ses chevilles et poignets correspondrait à une combinaison des deux techniques, mais en traction par les poignets, seuls les poignets sont saisis."
            }
        ]
    },
    {
        text: "Quelle est la méthode appropriée pour dégager une victime d'un véhicule lors d'un dégagement d'urgence ?",
        answers: [
            {
                text: "Détacher la ceinture de sécurité, dégager les pieds de la victime des pédales, et tirer la victime hors du véhicule en la saisissant par les chevilles.",
                isCorrect: false,
                comment: "Saisir la victime par les chevilles correspondaient à une autre technique de dégagement d'urgence, pas au dégagement d'un véhicule."
            },
            {
                text: "Détacher la ceinture de sécurité, dégager les pieds de la victime des pédales, et tirer la victime hors du véhicule en la saisissant par les poignets.",
                isCorrect: false,
                comment: "Saisir la victime par les poignets correspondrait à une autre technique de dégagement d'urgence, pas au dégagement d'un véhicule."
            },
            {
                text: "Détacher la ceinture de sécurité, dégager les pieds de la victime des pédales, et tirer la victime hors du véhicule en la saisissant par les vêtements.",
                isCorrect: false,
                comment: "Saisir la victime par les vêtements correspondaient à une autre technique de dégagement d'urgence, pas au dégagement d'un véhicule."
            },
            {
                text: "Détacher la ceinture de sécurité, dégager les pieds de la victime des pédales, et tirer la victime hors du véhicule en la saisissant par les aisselles.",
                isCorrect: true,
                comment: "Effectivement, la méthode appropriée pour dégager une victime d'un véhicule lors d'un dégagement d'urgence est de détacher la ceinture de sécurité, dégager les pieds de la victime des pédales, et tirer la victime hors du véhicule en la saisissant par les aisselles."
            }
        ]
    },
    {
        text: "Quelle est la méthode recommandée pour dégager un enfant ou un nourrisson lors d'un dégagement d'urgence ?",
        answers: [
            {
                text: "Saisir l'enfant ou le nourrisson par les vêtements et le tirer sur le sol jusqu'à ce qu'il soit en lieu sûr.",
                isCorrect: false,
                comment: "Saisir l'enfant ou le nourrisson par les vêtements correspond à une technique de dégagement d'urgence pour les adultes, pas pour les enfants ou les nourrissons."
            },
            {
                text: "Utiliser une pince de désincarcération pour dégager l'enfant ou le nourrisson du véhicule.",
                isCorrect: false,
                comment: "Utiliser une pince de désincarcération est une méthode inappropriée pour dégager un enfant ou un nourrisson, car cela pourrait causer des blessures."
            },
            {
                text: "Dégager l'enfant ou le nourrisson en le portant dans les bras.",
                isCorrect: true,
                comment: "Effectivement, la méthode recommandée pour dégager un enfant ou un nourrisson lors d'un dégagement d'urgence est de le porter dans les bras pour le mettre en lieu sûr."
            },
            {
                text: "Tirer l'enfant ou le nourrisson par les chevilles jusqu'à ce qu'il soit en lieu sûr.",
                isCorrect: false,
                comment: "Tirer l'enfant ou le nourrisson par les chevilles peut être dangereux et aggraver ses blessures lors d'un dégagement d'urgence."
            }
        ]
    },{
        text: "Qu'est-ce qu'un accident d'exposition à un risque viral ?",
        answers: [
            {
                text: "Toute exposition percutanée ou contact direct avec du sang ou un liquide biologique souillé par du sang.",
                isCorrect: true,
                comment: "Effectivement, un accident d'exposition à un risque viral est défini comme toute exposition percutanée (par piqûre ou coupure) ou tout contact direct sur une peau lésée ou des muqueuses avec du sang ou un liquide biologique souillé par du sang."
            },
            {
                text: "Toute exposition à des substances toxiques.",
                isCorrect: false,
                comment: "Cette réponse ne correspond pas à la définition donnée d'un accident d'exposition à un risque viral."
            },
            {
                text: "Toute exposition à des substances radioactives.",
                isCorrect: false,
                comment: "Cette réponse ne correspond pas à la définition donnée d'un accident d'exposition à un risque viral."
            },
            {
                text: "Toute exposition à des bactéries ou des champignons.",
                isCorrect: false,
                comment: "Cette réponse ne correspond pas à la définition donnée d'un accident d'exposition à un risque viral."
            }
        ]
    },
    {
        text: "Quels sont les liquides biologiques considérés comme présentant un risque de transmission des virus VIH, VHB et VHC lors d'un accident d'exposition ?",
        answers: [
            {
                text: "Sang, salive, urine, liquide amniotique.",
                isCorrect: false,
                comment: "La salive, les urines et le liquide amniotique ne sont pas considérés comme présentant un risque de transmission des virus VIH, VHB et VHC, sauf s'ils contiennent du sang."
            },
            {
                text: "Sang, salive, sperme, sécrétions vaginales.",
                isCorrect: true,
                comment: "Exact, le sang, la salive, le sperme et les sécrétions vaginales présentent un risque de transmission des virus VIH, VHB et VHC. En effet la salive peut contenir du sang."
            },
            {
                text: "Sang, urine, liquide céphalo-rachidien, sécrétions nasales.",
                isCorrect: false,
                comment: "Les urines, le liquide céphalo-rachidien et les sécrétions nasales ne sont pas considérés comme présentant un risque de transmission des virus VIH, VHB et VHC."
            },
            {
                text: "Sang, sueur, larmes, liquide synovial.",
                isCorrect: false,
                comment: "La sueur, les larmes et le liquide synovial ne sont pas considérés comme présentant un risque de transmission des virus VIH, VHB et VHC."
            }
        ]
    },
    {
        text: "Quels sont les principaux risques associés à un accident d'exposition à un risque viral ?",
        answers: [
            {
                text: "Infection par des bactéries et des champignons.",
                isCorrect: false,
                comment: "Les principaux risques associés à un accident d'exposition à un risque viral sont la transmission des virus VIH, VHB et VHC, et non l'infection par des bactéries et des champignons."
            },
            {
                text: "Transmission des virus VIH, VHB et VHC.",
                isCorrect: true,
                comment: "C'est exact, les principaux risques associés à un accident d'exposition à un risque viral sont la transmission des virus VIH, VHB et VHC."
            },
            {
                text: "Développement de maladies auto-immunes.",
                isCorrect: false,
                comment: "Les maladies auto-immunes ne sont pas directement associées à un accident d'exposition à un risque viral."
            },
            {
                text: "Réaction allergique sévère.",
                isCorrect: false,
                comment: "Les réactions allergiques ne sont pas directement associées à un accident d'exposition à un risque viral."
            }
        ]
    },
    {
        text: "Quels signes doivent alerter concernant un accident d'exposition à un risque viral ?",
        answers: [
            {
                text: "Une coupure avec un objet propre.",
                isCorrect: false,
                comment: "Une coupure avec un objet propre ne constitue pas un accident d'exposition à un risque viral, il doit y avoir un contact avec du sang ou un liquide biologique contaminé par du sang."
            },
            {
                text: "Une projection de sang dans les yeux.",
                isCorrect: true,
                comment: "Effectivement, une projection de sang dans les yeux peut être un signe d'accident d'exposition à un risque viral."
            },
            {
                text: "Un contact avec de l'urine.",
                isCorrect: false,
                comment: "Un contact avec de l'urine ne constitue pas un accident d'exposition à un risque viral, sauf si elle contient du sang."
            },
            {
                text: "Un contact avec de la sueur.",
                isCorrect: false,
                comment: "Un contact avec de la sueur ne constitue pas un accident d'exposition à un risque viral."
            }
        ]
    },
    {
        text: "Quel est le principe de l'action de secours en cas d'accident d'exposition à un risque viral ?",
        answers: [
            {
                text: "Assurer immédiatement les gestes de secours sans prendre en compte le risque viral.",
                isCorrect: false,
                comment: "Il est essentiel de prendre en compte le risque viral lors de l'action de secours pour appliquer les mesures appropriées."
            },
            {
                text: "Réaliser immédiatement les soins adaptés en cas d'accident d'exposition à un risque viral avéré.",
                isCorrect: true,
                comment: "C'est correct, l'action de secours doit permettre de réaliser immédiatement les soins adaptés en cas d'accident d'exposition à un risque viral avéré."
            },
            {
                text: "Attendre l'arrivée des secours médicaux sans intervenir.",
                isCorrect: false,
                comment: "Attendre l'arrivée des secours médicaux sans intervenir peut aggraver la situation. Il est important d'agir rapidement en cas d'accident d'exposition à un risque viral."
            },
            {
                text: "Réaliser une désinfection sommaire de la plaie avant toute autre action.",
                isCorrect: false,
                comment: "Une désinfection sommaire de la plaie ne suffit pas en cas d'accident d'exposition à un risque viral. Il est nécessaire de suivre les protocoles appropriés."
            }
        ]
    },
    {
    "text": "Que doit-on faire dès la constatation d'un accident d'exposition à un risque viral ?",
    "answers": [
        {
            "text": "Interrompre l'action de secours en cours et se faire relayer.",
            "isCorrect": true,
            "comment": "Correct, il est important d'interrompre l'action de secours en cours pour gérer l'accident d'exposition à un risque viral."
        },
        {
            "text": "Continuer l'action de secours sans interruption.",
            "isCorrect": false,
            "comment": "Ce n'est pas la procédure recommandée pour un accident d'exposition à un risque viral."
        },
        {
            "text": "Nettoyer immédiatement la plaie avec de l'alcool.",
            "isCorrect": false,
            "comment": "Nettoyer immédiatement la plaie est important, mais ce n'est pas la première action à prendre."
        },
        {
            "text": "Appliquer une compresse stérile sur la plaie.",
            "isCorrect": false,
            "comment": "Ce n'est pas la première action à prendre en cas d'accident d'exposition à un risque viral."
        }
    ]
    },
    {
    "text": "Quelles sont les mesures à prendre en cas d'exposition à un risque viral via une plaie ?",
    "answers": [
        {
            "text": "Faire saigner la plaie puis nettoyer avec de l'eau et du savon.",
            "isCorrect": false,
            "comment": "Faire saigner la plaie n'est pas recommandé dans ce cas."
        },
        {
            "text": "Appliquer un antiseptique à large spectre directement sur la plaie.",
            "isCorrect": false,
            "comment": "L'utilisation d'un antiseptique à large spectre n'est pas la première mesure à prendre en cas d'exposition à un risque viral."
        },
        {
            "text": "Ne pas faire saigner, nettoyer à l'eau courante et au savon, puis réaliser l'asepsie.",
            "isCorrect": true,
            "comment": "Correct, ne pas faire saigner la plaie, la nettoyer à l'eau courante et au savon, puis réaliser l'asepsie sont les mesures recommandées."
        },
        {
            "text": "Utiliser des produits pour le traitement hygiénique des mains par friction.",
            "isCorrect": false,
            "comment": "Ce type de produit n'est pas adapté pour traiter une plaie exposée à un risque viral."
        }
    ]
    },
    {
    "text": "Quelles actions sont recommandées en cas de projection de liquide biologique sur les muqueuses, en particulier au niveau de la conjonctive ?",
    "answers": [
        {
            "text": "Ne rien faire et attendre que ça se résolve.",
            "isCorrect": false,
            "comment": "Attendre n'est pas la bonne approche dans ce cas."
        },
        {
            "text": "Rincer abondamment durant au moins cinq minutes avec de l'eau.",
            "isCorrect": true,
            "comment": "Correct, rincer abondamment avec de l'eau est la bonne mesure à prendre en cas de projection de liquide biologique sur les muqueuses."
        },
        {
            "text": "Appliquer un antiseptique puissant sur la zone touchée.",
            "isCorrect": false,
            "comment": "L'application d'un antiseptique n'est pas la première mesure recommandée dans ce cas."
        },
        {
            "text": "Utiliser un soluté isotonique pour nettoyer la zone touchée.",
            "isCorrect": false,
            "comment": "Bien que le soluté isotonique soit adapté, l'utilisation de l'eau est généralement plus pratique et suffisante."
        }
    ]
    },
    
    {
    "text": "Quelle est la principale voie de transmission des microorganismes dans le contexte des risques infectieux ?",
    "answers": [
        {
            "text": "Par les gouttelettes de 'pflugge'.",
            "isCorrect": false,
            "comment": "Bien que les gouttelettes de 'pflugge' soient une voie de transmission, ce n'est pas la principale dans ce contexte."
        },
        {
            "text": "Par contact direct avec une personne potentiellement infectée.",
            "isCorrect": true,
            "comment": "Correct, le contact direct avec une personne infectée est la principale voie de transmission des microorganismes dans ce contexte."
        },
        {
            "text": "Par l'ingestion d'aliments contaminés.",
            "isCorrect": false,
            "comment": "L'ingestion d'aliments contaminés peut être une voie de transmission, mais ce n'est pas la principale dans ce contexte."
        },
        {
            "text": "Par inhalation de particules en suspension dans l'air.",
            "isCorrect": false,
            "comment": "Bien que cela puisse être une voie de transmission, ce n'est pas la principale dans ce contexte."
        }
    ]
    },
    {
    "text": "Quelles sont les précautions recommandées pour limiter le risque de transmission d'infections entre la victime et l'intervenant ?",
    "answers": [
        {
            "text": "Ne pas porter de gants pendant l'intervention pour mieux sentir les choses.",
            "isCorrect": false,
            "comment": "Ne pas porter de gants augmente le risque de transmission d'infections, ce n'est donc pas recommandé."
        },
        {
            "text": "Utiliser un masque uniquement si la victime tousse ou éternue.",
            "isCorrect": false,
            "comment": "Il est recommandé d'utiliser un masque en tout temps pour limiter la transmission d'infections, pas seulement lorsque la victime tousse ou éternue."
        },
        {
            "text": "Appliquer systématiquement des précautions d'hygiène standards (gants masques etc).",
            "isCorrect": true,
            "comment": "Correct, l'application de précautions d'hygiène standards est essentielle pour limiter le risque de transmission d'infections entre la victime et l'intervenant."
        },
        {
            "text": "Porter un tablier en plastique uniquement si la victime saigne abondamment.",
            "isCorrect": false,
            "comment": "Il est recommandé de porter un tablier en plastique en tout temps lors d'une intervention pour limiter la transmission d'infections, pas seulement en cas de saignement abondant."
        }
    ]
    },
    
    
    {
    "text": "Quelle est l'une des précautions recommandées pendant l'intervention pour limiter le risque infectieux ?",
    "answers": [
        {
            "text": "Porter des vêtements élégants.",
            "isCorrect": false,
            "comment": "Porter des vêtements élégants n'est pas une mesure recommandée pour limiter le risque infectieux pendant l'intervention."
        },
        {
            "text": "Changer de tenue dès qu'elle est souillée.",
            "isCorrect": true,
            "comment": "Correct, il est recommandé de changer de tenue dès qu'elle est souillée pour limiter le risque infectieux."
        },
        {
            "text": "Ignorer les procédures de gestion des déchets.",
            "isCorrect": false,
            "comment": "Ignorer les procédures de gestion des déchets peut augmenter le risque infectieux pendant l'intervention."
        },
        {
            "text": "Utiliser les mêmes gants pendant toute l'intervention.",
            "isCorrect": false,
            "comment": "Utiliser les mêmes gants pendant toute l'intervention peut augmenter le risque de contamination croisée."
        }
    ]
    },
    {
    "text": "Quelle est une mesure recommandée pour couvrir une plaie pendant l'intervention ?",
    "answers": [
        {
            "text": "Laisser la plaie à l'air libre.",
            "isCorrect": false,
            "comment": "Laisser une plaie à l'air libre peut augmenter le risque d'infection."
        },
        {
            "text": "Recouvrir la plaie par un pansement.",
            "isCorrect": true,
            "comment": "Correct, il est recommandé de recouvrir toute plaie par un pansement pour limiter le risque infectieux."
        },
        {
            "text": "Appliquer de la sauge sur la plaie.",
            "isCorrect": false,
            "comment": "Appliquer de la sauge sur la plaie n'est pas une mesure recommandée pendant l'intervention."
        },
        {
            "text": "Utiliser de l'alcool pour désinfecter la plaie.",
            "isCorrect": false,
            "comment": "L'utilisation d'alcool pour désinfecter une plaie peut être irritante et n'est pas recommandée."
        }
    ]
    },
    {
    "text": "Que faut-il faire après chaque transport sur le brancard pour limiter le risque infectieux ?",
    "answers": [
        {
            "text": "Utiliser les mêmes draps à usage unique pour chaque transport.",
            "isCorrect": false,
            "comment": "Utiliser les mêmes draps à usage unique pour chaque transport peut augmenter le risque de contamination croisée."
        },
        {
            "text": "Changer les draps après chaque transport.",
            "isCorrect": true,
            "comment": "Correct, il est recommandé d'utiliser de nouveaux draps après chaque transport sur le brancard pour limiter le risque infectieux."
        },
        {
            "text": "Ignorer l'entretien du brancard.",
            "isCorrect": false,
            "comment": "Ignorer l'entretien du brancard peut augmenter le risque infectieux."
        },
        {
            "text": "Ne rien faire, car le brancard est déjà propre.",
            "isCorrect": false,
            "comment": "Même si le brancard semble propre, il est recommandé de prendre des mesures pour limiter le risque infectieux après chaque transport."
        }
    ]
    },
    
    {
    "text": "Quelle est une mesure recommandée pour les intervenants en contact avec la victime afin de limiter la transmission des agents infectieux ?",
    "answers": [
        {
            "text": "Porter des gants à usage multiple.",
            "isCorrect": false,
            "comment": "Porter des gants à usage multiple augmente le risque de contamination croisée et n'est pas recommandé."
        },
        {
            "text": "Porter une surblouse et une protection des cheveux (charlotte) en cas de contact avec la victime ou des surfaces contaminées.",
            "isCorrect": true,
            "comment": "Correct, porter une surblouse et une protection des cheveux peut limiter la transmission des agents infectieux lors du contact avec la victime ou des surfaces contaminées."
        },
        {
            "text": "Se laver les mains uniquement après avoir touché la victime.",
            "isCorrect": false,
            "comment": "Se laver les mains après avoir touché la victime est important, mais d'autres mesures de protection sont également nécessaires."
        },
        {
            "text": "Ne pas porter de masque de protection.",
            "isCorrect": false,
            "comment": "Le port d'un masque de protection est recommandé pour limiter la transmission des agents infectieux."
        }
    ]
    },
    {
    "text": "Que faut-il faire pour la victime afin de limiter la dissémination des particules infectieuses ?",
    "answers": [
        {
            "text": "Ne rien faire, car la victime est déjà isolée.",
            "isCorrect": false,
            "comment": "Même si la victime est isolée, il existe des mesures supplémentaires pour limiter la dissémination des particules infectieuses."
        },
        {
            "text": "Porter une surblouse et une protection des cheveux.",
            "isCorrect": false,
            "comment": "Les surblouses et les protections des cheveux sont destinées aux intervenants, pas à la victime."
        },
        {
            "text": "Porter un masque de type chirurgical ou un masque de protection respiratoire.",
            "isCorrect": true,
            "comment": "Correct, le port d'un masque de type chirurgical ou d'un masque de protection respiratoire par la victime peut limiter la dissémination des particules infectieuses."
        },
        {
            "text": "Ne rien porter, car cela n'a pas d'effet sur la dissémination des particules infectieuses.",
            "isCorrect": false,
            "comment": "Le port d'un masque par la victime peut limiter la dissémination des particules infectieuses."
        }
    ]
    },
    {
    "text": "Quels sont les types de déchets distingués dans l'utilisation des emballages pour l'élimination des déchets des activités de soins à risques infectieux (DASRI) ?",
    "answers": [
    {
      "text": "Les deux types de déchets distingués sont les matériels piquants, coupants et tranchants (aiguilles, scalpels, lames de rasoir) et les déchets mous (compresses, pansements, champs, draps à usage unique).",
      "isCorrect": true,
      "comment": "Correct ! Les deux types de déchets distingués dans l'utilisation des emballages pour l'élimination des déchets des activités de soins à risques infectieux (DASRI) sont les matériels piquants, coupants et tranchants, ainsi que les déchets mous."
    },
    {
      "text": "Les déchets liquides et solides.",
      "isCorrect": false,
      "comment": "Non, ce n'est pas correct. Les deux types de déchets distingués dans l'utilisation des emballages pour l'élimination des déchets des activités de soins à risques infectieux (DASRI) sont les matériels piquants, coupants et tranchants, ainsi que les déchets mous."
    },
    {
      "text": "Les déchets organiques et inorganiques.",
      "isCorrect": false,
      "comment": "Non, ce n'est pas la bonne réponse. Les types de déchets distingués dans l'utilisation des emballages pour l'élimination des déchets des activités de soins à risques infectieux (DASRI) sont spécifiquement les matériels piquants, coupants et tranchants, ainsi que les déchets mous."
    },
    {
      "text": "Les déchets recyclables et non recyclables.",
      "isCorrect": false,
      "comment": "Non, ce n'est pas la bonne réponse. Les types de déchets distingués dans l'utilisation des emballages pour l'élimination des déchets des activités de soins à risques infectieux (DASRI) sont spécifiquement les matériels piquants, coupants et tranchants, ainsi que les déchets mous."
    }
    ]
    },
    {
    "text": "Quelles sont les règles générales à suivre lors de l'utilisation des emballages pour l'élimination des déchets des activités de soins à risques infectieux (DASRI) ?",
    "answers": [
    {
      "text": "Les règles générales à suivre comprennent ne rien laisser sur les lieux de l'action de secours, ne jamais recapuchonner les aiguilles ni séparer les aiguilles d'une seringue ou d'une tubulure à perfusion avant de les mettre dans le collecteur, utiliser l'emballage conforme adapté au déchet, ne pas jeter de DASRI aux ordures ménagères, et déposer les emballages pleins dans un lieu prévu à cet effet.",
      "isCorrect": true,
      "comment": "Correct ! Les règles générales à suivre lors de l'utilisation des emballages pour l'élimination des déchets des activités de soins à risques infectieux (DASRI) comprennent plusieurs points, notamment ne rien laisser sur les lieux de l'action de secours, ne jamais recapuchonner les aiguilles, utiliser l'emballage adapté, et déposer les emballages pleins dans un lieu approprié."
    },
    {
      "text": "Il n'est pas nécessaire de déposer les emballages pleins dans un lieu prévu à cet effet.",
      "isCorrect": false,
      "comment": "Non, ce n'est pas correct. Il est essentiel de déposer les emballages pleins dans un lieu prévu à cet effet pour assurer une élimination appropriée des déchets des activités de soins à risques infectieux (DASRI)."
    },
    {
      "text": "Il est recommandé de séparer les aiguilles d'une seringue ou d'une tubulure à perfusion avant de les mettre dans le collecteur.",
      "isCorrect": false,
      "comment": "Non, ce n'est pas la bonne pratique. Il ne faut jamais séparer les aiguilles d'une seringue ou d'une tubulure à perfusion avant de les mettre dans le collecteur pour éviter les accidents d'exposition au sang."
    },
    {
      "text": "Il est recommandé de jeter les DASRI aux ordures ménagères.",
      "isCorrect": false,
      "comment": "Non, ce n'est pas une pratique sûre. Les DASRI ne doivent jamais être jetés aux ordures ménagères car ils représentent une source importante de transmission des infections et d'accidents d'exposition au risque viral."
    }
    ]
    },
    {
    "text": "Quelles sont les précautions à prendre lors de la manipulation des déchets des activités de soins à risques infectieux (DASRI) ?",
    "answers": [
    
    {
      "text": "Il n'est pas nécessaire de fermer l'emballage après avoir déposé le déchet.",
      "isCorrect": false,
      "comment": "Non, ce n'est pas correct. Il est essentiel de fermer immédiatement l'emballage après avoir déposé le déchet pour éviter toute exposition supplémentaire aux risques infectieux."
    },
    {
      "text": "Il est recommandé de remplir l'emballage au-delà de la limite indiquée.",
      "isCorrect": false,
      "comment": "Non, ce n'est pas une bonne pratique. Il faut éviter de remplir l'emballage au-delà de la limite indiquée pour assurer une manipulation sûre des déchets des activités de soins à risques infectieux (DASRI)."
    },
    {
      "text": "Il est recommandé de tasser les déchets à l'intérieur de l'emballage à DASRI.",
      "isCorrect": false,
      "comment": "Non, ce n'est pas une bonne pratique. Il ne faut pas tasser les déchets à l'intérieur de l'emballage à DASRI car cela peut compromettre la sécurité lors de la manipulation et de l'élimination des déchets."
    },
    {
        "text": "Les précautions à prendre comprennent l'ouverture préalable de l'emballage, le dépôt du déchet dans l'emballage suivi de sa fermeture immédiate, l'évitement de remplir l'emballage au-delà de la limite indiquée, de tasser les déchets à l'intérieur de l'emballage, et la fermeture de l'emballage lorsque le taux maximum de remplissage est atteint.",
        "isCorrect": true,
        "comment": "Correct ! Les précautions à prendre lors de la manipulation des déchets des activités de soins à risques infectieux (DASRI) incluent plusieurs étapes, telles que l'ouverture préalable de l'emballage, le dépôt du déchet suivi de la fermeture immédiate de l'emballage, et le respect des limitations de remplissage et de la date de péremption."
      },
    ]
    },{
        text: "Qu'est-ce qu'une crise d'asthme ?",
        answers: [
          { text: "Un arrêt cardiaque soudain.", isCorrect: false },
          { text: "Une détresse respiratoire causée par une inflammation et une contraction des bronchioles.", isCorrect: true },
          { text: "Une infection virale des voies respiratoires.", isCorrect: false }
        ]
      },
      
      // Question 2
      {
        text: "Quels sont les facteurs déclenchants d'une crise d'asthme ?",
        answers: [
          { text: "Le contact avec un allergène, une infection respiratoire, la pollution, l'effort physique.", isCorrect: true },
          { text: "La consommation excessive de sucre.", isCorrect: false },
          { text: "La pratique régulière d'exercices de relaxation.", isCorrect: false }
        ]
      },
      
      // Question 3
      {
        text: "Quel est le rôle des médicaments dans la crise d'asthme ?",
        answers: [
          { text: "Ils stimulent le système immunitaire pour combattre l'inflammation.", isCorrect: false },
          { text: "Ils abaissent la pression artérielle pour réduire l'anxiété.", isCorrect: false },
          { text: "Ils relaxent les bronchioles pour faciliter la respiration.", isCorrect: true }
        ]
      },
      
      // Question 4
      {
        text: "Quels sont les signes caractéristiques d'une crise d'asthme grave ?",
        answers: [
          { text: "Difficulté à parler, agitation, sifflement à l'expiration.", isCorrect: true },
          { text: "Fatigue extrême et confusion mentale.", isCorrect: false },
          { text: "Hypotension artérielle et pâleur cutanée.", isCorrect: false }
        ]
      },
      
      // Question 5
      {
        text: "Que doit faire le secouriste en cas de crise d'asthme chez une victime consciente ?",
        answers: [
          { text: "Administre immédiatement de l'oxygène en inhalation.", isCorrect: false },
          { text: "Faciliter la respiration, aider la victime à prendre son traitement, demander un avis médical.", isCorrect: true  },
          { text: "Placer la victime en position couchée pour lui permettre de se reposer.", isCorrect: false }
        ]
      },
      
      // Question 6
      {
        text: "Quelle est la position généralement recommandée pour une victime en crise d'asthme ?",
        answers: [
          { text: "Allongée sur le dos les jambes relevées.", isCorrect: false },
          { text: "Couchée sur le ventre.", isCorrect: false },
          { text: "Assise ou demi-assise.", isCorrect: true }
        ]
      },
      
      // Question 7
      {
        text: "Quels sont les gestes à éviter lors de la prise en charge d'une crise d'asthme ?",
        answers: [
          { text: "Rien qui pourrait gêner la respiration de la victime.", isCorrect: true },
          { text: "Masser vigoureusement le dos de la victime.", isCorrect: false },
          { text: "Administrer de l'eau froide à boire à la victime.", isCorrect: false }
        ]
      },
      
      // Question 8
      {
        text: "Que doit faire le secouriste si la victime perd connaissance lors d'une crise d'asthme ?",
        answers: [
          { text: "Administrer un médicament anti-allergique par voie orale.", isCorrect: false },
          { text: "Appliquer la conduite à tenir devant un arrêt cardiaque si la victime ne respire plus.", isCorrect: true },
          { text: "Demander à la victime de prendre des respirations profondes.", isCorrect: false }
        ]
      },
      
      // Question 9
      {
        text: "Quelle est la principale recommandation pour aider une victime d'asthme à prendre son traitement ?",
        answers: [
          { text: "Administrer le traitement sans demander l'avis de la victime.", isCorrect: false },
          { text: "Demander à la victime de se calmer et de respirer profondément.", isCorrect: false },
          { text: "Rassurer la victime et l'aider à utiliser son aérosol doseur.", isCorrect: true }
        ]
      },
      
      // Question 10
      {
        text: "Pourquoi est-il important de demander un avis médical en cas de crise d'asthme ?",
        answers: [
          { text: "Pour évaluer la gravité de la crise et ajuster le traitement si nécessaire.", isCorrect: true },
          { text: "Pour éviter que la victime ne développe une allergie aux médicaments.", isCorrect: false },
          { text: "Pour obtenir des conseils sur la gestion du stress.", isCorrect: false }
        ]
      },// Question 1
      {
        text: "Qu'est-ce qu'un accident vasculaire cérébral (AVC) ?",
        answers: [
          { text: "Une rupture d'un vaisseau sanguin dans le cerveau.", isCorrect: false },
          { text: "Un déficit neurologique soudain d'origine vasculaire.", isCorrect: true },
          { text: "Une perte de conscience brève et passagère.", isCorrect: false }
        ]
      },
      
      // Question 2
      {
        text: "Quelle est la principale cause d'AVC ?",
        answers: [
          { text: "L'obstruction d'une artère cérébrale.", isCorrect: true },
          { text: "Une hémorragie cérébrale.", isCorrect: false },
          { text: "Une perte de connaissance due à une maladie.", isCorrect: false }
        ]
      },
      
      // Question 3
      {
        text: "Quels sont les signes spécifiques d'un AVC selon le FAST test ?",
        answers: [
          { text: "Fatigue, Appetite et Stress.", isCorrect: false },
          { text: "Fever, Arm et Spasm.", isCorrect: false },
          { text: "Face, Arm et Speech (langage).", isCorrect: true }
        ]
      },
      
      // Question 4
      {
        text: "Quelle est la première cause de handicap chez l'adulte ?",
        answers: [
          { text: "L'accident vasculaire cérébral (AVC).", isCorrect: true },
          { text: "Les troubles cardiaques.", isCorrect: false },
          { text: "Les accidents de voiture.", isCorrect: false }
        ]
      },
      
      // Question 5
      {
        text: "Que doit faire un secouriste si une victime présente des signes d'AVC ?",
        answers: [
          { text: "Attendre que les symptômes disparaissent d'eux-mêmes.", isCorrect: false },
          { text: "Demander un avis médical immédiat et respecter les consignes.", isCorrect: true },
          { text: "Donner à la victime des médicaments contre la douleur.", isCorrect: false }
        ]
      },
      
      // Question 6
      {
        text: "Quels sont les trois signes spécifiques recherchés chez une victime d'AVC ?",
        answers: [
          { text: "Toux persistante, fièvre élevée, fatigue extrême.", isCorrect: false },
          { text: "Douleur abdominale, difficulté de respiration, vertiges.", isCorrect: false },
          { text: "Déformation de la bouche, faiblesse ou engourdissement des bras, difficulté de langage.", isCorrect: true }
        ]
      },
      
      // Question 7
      {
        text: "Quel est le principe de l'action de secours pour une victime d'AVC ?",
        answers: [
          { text: "Demander un avis médical immédiat, surveiller la victime et respecter les consignes.", isCorrect: true },
          { text: "Donner des médicaments pour réduire la pression artérielle.", isCorrect: false },
          { text: "Mettre la victime en position assise et lui donner de l'oxygène.", isCorrect: false }
        ]
      },
      
      // Question 8
      {
        text: "Quelle est la meilleure prise en charge pour les victimes d'AVC ?",
        answers: [
          { text: "Les acheminer vers un centre spécialisé en unité neuro-vasculaire.", isCorrect: true },
          { text: "Les traiter à domicile avec des médicaments.", isCorrect: false },
          { text: "Les envoyer dans n'importe quel hôpital proche.", isCorrect: false }
        ]
      },
      
      // Question 9
      {
        text: "Quel est l'effet de l'interruption de la circulation sanguine pendant un AVC ?",
        answers: [
          { text: "Un afflux excessif de sang dans le cerveau, provoquant des saignements.", isCorrect: false },
          { text: "Une ischémie des cellules nerveuses, suivie de leur détérioration et de leur mort.", isCorrect: true },
          { text: "Une augmentation de l'oxygénation du cerveau, améliorant la santé des cellules nerveuses.", isCorrect: false }
        ]
      },
      
      // Question 10
      {
        text: "Qu'est-ce qu'un accident ischémique transitoire (AIT) ?",
        answers: [
          { text: "Une obstruction de l'artère cérébrale se résorbant d'elle-même avec des signes passagers.", isCorrect: true },
          { text: "Une hémorragie cérébrale permanente entraînant des séquelles.", isCorrect: false },
          { text: "Une perte de conscience prolongée due à une hypoxie cérébrale.", isCorrect: false }
        ]
      },// Question 1
      {
        text: "Qu'est-ce qu'une crise convulsive généralisée ?",
        answers: [
          { text: "Un arrêt cardiaque soudain.", isCorrect: false },
          { text: "Une perturbation de l'activité électrique cérébrale se traduisant par des mouvements musculaires incontrôlés.", isCorrect: true},
          { text: "Une perte de connaissance due à un traumatisme crânien.", isCorrect: false }
        ]
      },
      
      // Question 2
      {
        text: "Quelles peuvent être les causes d'une crise convulsive généralisée ?",
        answers: [
          { text: "Le traumatisme crânien, certaines maladies, l'épilepsie, l'hypoglycémie, l'absorption de poisons.", isCorrect: true },
          { text: "Une insolation prolongée.", isCorrect: false },
          { text: "Une carence en vitamines.", isCorrect: false }
        ]
      },
      
      // Question 3
      {
        text: "Quels sont les signes caractéristiques d'une crise convulsive généralisée ?",
        answers: [
          { text: "Fatigue extrême et confusion mentale.", isCorrect: false },
          { text: "Maux de tête sévères et vision floue.", isCorrect: false },
          { text: "Perte brutale de connaissance, raideur musculaire, secousses involontaires, révulsion oculaire.", isCorrect: true }
        ]
      },
      
      // Question 4
      {
        text: "Qu'est-ce que l'état de mal convulsif ?",
        answers: [
          { text: "La succession de plusieurs crises convulsives sans reprise de conscience entre les crises.", isCorrect: true },
          { text: "Une amnésie temporaire après une crise convulsive.", isCorrect: false },
          { text: "Un état de confusion mentale prolongé.", isCorrect: false }
        ]
      },
      
      // Question 5
      {
        text: "Quelle est la principale action à prendre au début d'une crise convulsive ?",
        answers: [
          { text: "Demander à la victime de se lever et de marcher pour stimuler la circulation sanguine.", isCorrect: false },
          { text: "Allonger la victime au sol pour éviter qu'elle ne se blesse en chutant.", isCorrect: true },
          { text: "Donner à la victime des médicaments pour calmer les convulsions.", isCorrect: false }
        ]
      },
      
      // Question 6
      {
        text: "Que doit faire le secouriste pendant une crise convulsive ?",
        answers: [
          { text: "Maintenir la victime en position assise pour éviter qu'elle ne tombe.", isCorrect: false },
          { text: "Donner à la victime de l'oxygène pour faciliter sa respiration.", isCorrect: false },
          { text: "Protéger la tête de la victime, écarter les objets traumatisants, ne rien placer dans sa bouche.", isCorrect: true }
        ]
      },
      
      // Question 7
      {
        text: "Que faire à la fin des convulsions d'une crise convulsive ?",
        answers: [
          { text: "Vérifier les voies aériennes de la victime, sa respiration, et l'installer en PLS si elle respire.", isCorrect: true },
          { text: "Laisser la victime seule pour qu'elle se repose.", isCorrect: false },
          { text: "Donner à la victime de l'eau pour qu'elle s'hydrate.", isCorrect: false }
        ]
      },
      
      // Question 8
      {
        text: "Quelle mesure doit être réalisée après la phase convulsive d'une crise convulsive ?",
        answers: [
          { text: "Une mesure de la pression artérielle.", isCorrect: false },
          { text: "Une mesure de la glycémie capillaire.", isCorrect: true },
          { text: "Une prise de température corporelle.", isCorrect: false }
        ]
      },
      
      // Question 9
      {
        text: "Quelle est la principale différence dans la prise en charge d'une crise convulsive chez un nourrisson ?",
        answers: [
          { text: "Donner à l'enfant des médicaments pour calmer les convulsions.", isCorrect: false },
          { text: "Aucune différence significative dans la prise en charge.", isCorrect: false },
          { text: "En plus des actions pour l'adulte, prendre la température de l'enfant et le ventiler en cas d'arrêt respiratoire.", isCorrect: true }
        ]
      },
      
      // Question 10
      {
        text: "Quand doit-on transmettre un bilan après une crise convulsive ?",
        answers: [
          { text: "Immédiatement après avoir pris les premières mesures de secours.", isCorrect: true },
          { text: "Une fois que la victime est complètement rétablie.", isCorrect: false },
          { text: "Avant de commencer les gestes de secours.", isCorrect: false }
        ]
      },// Question 1
      {
        text: "Qu'est-ce que la douleur thoracique ?",
        answers: [
          { text: "Une douleur perçue au niveau du thorax.", isCorrect: true },
          { text: "Une douleur ressentie dans le bas du dos.", isCorrect: false },
          { text: "Une douleur localisée dans les membres supérieurs.", isCorrect: false }
        ]
      },
      
      // Question 2
      {
        text: "Quelles sont les principales causes de douleur thoracique non traumatique ?",
        answers: [
          { text: "Fracture des côtes, blessure au sternum, contusion pulmonaire.", isCorrect: false },
          { text: "Occlusion d'une artère coronaire, infection pulmonaire, reflux gastro-œsophagien.", isCorrect: true },
          { text: "Maux de tête, douleurs abdominales, engourdissement des membres.", isCorrect: false }
        ]
      },
      
      // Question 3
      {
        text: "Quels signes peuvent accompagner la douleur thoracique ?",
        answers: [
          { text: "Vertiges, troubles de la vision, perte d'équilibre.", isCorrect: false },
          { text: "Picotements dans les bras, sensation de chaleur dans les jambes.", isCorrect: false },
          { text: "Malaise, pâleur, sueurs, nausées.", isCorrect: true }
        ]
      },
      
      // Question 4
      {
        text: "Quel est le principal risque associé à une douleur thoracique ?",
        answers: [
          { text: "Atteinte des fonctions vitales, comme un infarctus ou une détresse respiratoire.", isCorrect: true },
          { text: "Risque de fracture des côtes ou de blessure au sternum.", isCorrect: false },
          { text: "Possibilité de développer une allergie alimentaire.", isCorrect: false }
        ]
      },
      
      // Question 5
      {
        text: "Comment la douleur thoracique peut-elle évoluer dans le temps ?",
        answers: [
          { text: "Elle diminue progressivement avec le temps.", isCorrect: false },
          { text: "Elle peut être continue ou intermittente, et sa durée doit être précisée.", isCorrect: true },
          { text: "Elle s'aggrave brusquement sans prévenir.", isCorrect: false }
        ]
      },
      
      // Question 6
      {
        text: "Que doit faire le secouriste en cas de douleur thoracique chez une victime consciente ?",
        answers: [
          { text: "Administer un médicament anti-inflammatoire sans demander l'avis de la victime.", isCorrect: false },
          { text: "Appliquer immédiatement un massage cardiaque.", isCorrect: false },
          { text: "Préserver les fonctions vitales, demander un avis médical, aider la victime à prendre un traitement si nécessaire.", isCorrect: true }
        ]
      },
      
      // Question 7
      {
        text: "Quelles sont les positions recommandées pour une victime de douleur thoracique ?",
        answers: [
          { text: "Assise ou demi-assise.", isCorrect: true },
          { text: "Allongée sur le ventre.", isCorrect: false },
          { text: "Allongée sur le dos les jambes relevées.", isCorrect: false }
        ]
      },
      
      // Question 8
      {
        text: "Que doit faire le secouriste si la victime perd conscience lors de douleurs thoraciques ?",
        answers: [
          { text: "Attendre que la victime reprenne conscience naturellement.", isCorrect: false },
          { text: "Appliquer la conduite à tenir adaptée et réaliser en priorité les gestes d'urgence qui s'imposent.", isCorrect: true },
          { text: "Administer un médicament contre la douleur.", isCorrect: false }
        ]
      },
      
      // Question 9
      {
        text: "Pourquoi est-il important de demander un avis médical en cas de douleur thoracique ?",
        answers: [
          { text: "Pour prescrire un traitement sans tenir compte de la gravité de la situation.", isCorrect: false },
          { text: "Pour obtenir des conseils sur la relaxation.", isCorrect: false },
          { text: "Pour évaluer la gravité de la situation et orienter la prise en charge appropriée.", isCorrect: true }
        ]
      },
      
      // Question 10
      {
        text: "Quelles sont les premières mesures à prendre en cas de douleur thoracique chez une victime consciente et en détresse respiratoire ?",
        answers: [
          { text: "Appliquer la conduite à tenir adaptée à une détresse respiratoire (position assise ou demi-assise, oxygène si nécessaire) et demander un avis médical.", isCorrect: true },
          { text: "Appliquer la conduite à tenir adaptée à une détresse circulatoire (position allongée horizontale, oxygène si nécessaire) et demander un avis médical.", isCorrect: false },
          { text: "Mettre la victime au repos immédiatement et lui administrer un médicament contre la douleur.", isCorrect: false }
        ]
      },{
        "text": "Quelle est la différence entre une piqûre et une morsure ?",
        "answers": [
            {
                "text": "Une piqûre concerne les atteintes provoquées par certains insectes, tandis qu'une morsure concerne les plaies provoquées par des dents ou des crochets.",
                "isCorrect": true,
                "comment": "Correct. Une piqûre implique généralement des insectes, tandis qu'une morsure implique des dents ou des crochets."
            },
            {
                "text": "Une piqûre est causée par des insectes, tandis qu'une morsure est causée par des animaux domestiques ou sauvages.",
                "isCorrect": false,
                "comment": "Incorrect. Les piqûres peuvent être causées par des insectes, mais les morsures ne sont pas limitées aux animaux domestiques ou sauvages."
            },
            {
                "text": "Une piqûre est toujours volontaire, tandis qu'une morsure peut être accidentelle ou volontaire.",
                "isCorrect": false,
                "comment": "Incorrect. Ni les piqûres ni les morsures ne sont nécessairement volontaires."
            },
            {
                "text": "Une piqûre concerne les attaques par des dents ou des crochets, tandis qu'une morsure implique une pression sur la gorge.",
                "isCorrect": false,
                "comment": "Incorrect. Cette réponse est incorrecte car elle mélange les définitions de piqûre et de morsure."
            }
        ]
    },
    {
        "text": "Quels sont les différents types d'animaux qui sont sources de piqûres et morsures ?",
        "answers": [
            {
                "text": "Reptiles et amphibiens",
                "isCorrect": false,
                "comment": "Incorrect. Les reptiles et les amphibiens peuvent mordre ou piquer, mais il existe d'autres types d'animaux également."
            },
            {
                "text": "Oiseaux et poissons",
                "isCorrect": false,
                "comment": "Incorrect. Bien que les oiseaux et les poissons puissent causer des blessures, d'autres types d'animaux sont également des sources de piqûres et de morsures."
            },
            {
                "text": "Mammifères, insectes, animaux marins et reptiles",
                "isCorrect": true,
                "comment": "Correct. Les mammifères, les insectes, les animaux marins et les reptiles peuvent tous causer des piqûres ou des morsures."
            },
            {
                "text": "Arachnides et insectes",
                "isCorrect": false,
                "comment": "Incorrect. Bien que les arachnides et les insectes puissent piquer, d'autres types d'animaux peuvent également causer des piqûres ou des morsures."
            }
        ]
    },
    {
        "text": "Quels sont les risques associés aux piqûres et morsures ?",
        "answers": [
            {
                "text": "Risque de brûlures",
                "isCorrect": false,
                "comment": "Incorrect. Les brûlures ne sont pas des risques typiques associés aux piqûres et morsures."
            },
            {
                "text": "Risque de fracture",
                "isCorrect": false,
                "comment": "Incorrect. Les fractures ne sont pas des risques typiques associés aux piqûres et morsures."
            },
            {
                "text": "Risque d'hémorragie externe, de plaie infectieuse, d'inoculation de substances toxiques et de réaction allergique grave",
                "isCorrect": true,
                "comment": "Correct. Les risques associés aux piqûres et morsures comprennent notamment l'hémorragie, les infections, l'inoculation de substances toxiques et les réactions allergiques graves."
            },
            {
                "text": "Risque de choc électrique",
                "isCorrect": false,
                "comment": "Incorrect. Le risque de choc électrique n'est pas associé aux piqûres et morsures."
            }
        ]
    },
    {
        "text": "Quelle est la mesure recommandée pour les morsures d'animaux suspects de rage ?",
        "answers": [
            {
                "text": "Appliquer immédiatement des compressions pour arrêter le saignement",
                "isCorrect": false,
                "comment": "Incorrect. La principale mesure recommandée est de consulter un médecin pour obtenir un vaccin antirabique."
            },
            {
                "text": "Laisser l'animal mordant en observation chez le propriétaire",
                "isCorrect": false,
                "comment": "Incorrect. La principale mesure recommandée est de consulter un médecin pour obtenir un vaccin antirabique."
            },
            {
                "text": "Consulter un médecin pour obtenir un vaccin antirabique",
                "isCorrect": true,
                "comment": "Correct. En cas de morsure par un animal suspect de rage, il est recommandé de consulter un médecin pour obtenir un vaccin antirabique."
            },
            {
                "text": "Aider la victime à s'injecter un traitement contre la rage",
                "isCorrect": false,
                "comment": "Incorrect. La vaccination contre la rage doit être administrée par un professionnel de la santé."
            }
        ]
    },
    {
        "text": "Quels sont les signes potentiels de piqûre ou de morsure chez une victime?",
        "answers": [
            {
                "text": "Sueur excessive et fièvre",
                "isCorrect": false,
                "comment": "Incorrect. La sueur excessive et la fièvre ne sont pas des signes typiques de piqûre ou de morsure."
            },
            {
                "text": "Perte de conscience et difficulté à respirer",
                "isCorrect": false,
                "comment": "Incorrect. Ces symptômes peuvent indiquer d'autres problèmes médicaux mais ne sont pas spécifiques aux piqûres ou morsures."
            },
            {
                "text": "Hémorragie externe et détresse respiratoire",
                "isCorrect": true,
                "comment": "Correct. L'hémorragie externe et la détresse respiratoire sont des signes potentiels de piqûre ou de morsure chez une victime."
            },
            {
                "text": "Vision floue et étourdissements",
                "isCorrect": false,
                "comment": "Incorrect. Ces symptômes peuvent indiquer d'autres problèmes médicaux mais ne sont pas spécifiques aux piqûres ou morsures."
            }
        ]
    },
    {
        "text": "Que doit-on faire en présence d'une piqûre d'insecte ?",
        "answers": [
            {
                "text": "Appliquer immédiatement un garrot",
                "isCorrect": false,
                "comment": "Incorrect. L'application d'un garrot n'est pas recommandée pour les piqûres d'insectes."
            },
            {
                "text": "Retirer rapidement le dard et appliquer du froid",
                "isCorrect": true,
                "comment": "Correct. Il est recommandé de retirer rapidement le dard et d'appliquer du froid pour réduire l'inflammation."
            },
            {
                "text": "Nettoyer la plaie avec de l'alcool",
                "isCorrect": false,
                "comment": "Incorrect. L'alcool peut irriter la plaie. Il est préférable de nettoyer avec de l'eau et du savon."
            },
            {
                "text": "Injecter un antidote contre les réactions allergiques",
                "isCorrect": false,
                "comment": "Incorrect. L'administration d'un antidote doit être réservée aux cas où une réaction allergique grave est présente."
            }
        ]
    },
    {
        "text": "Comment doit-on traiter une piqûre de méduse selon les recommandations ?",
        "answers": [
            {
                "text": "Appliquer immédiatement un pansement",
                "isCorrect": false,
                "comment": "Incorrect. L'application d'un pansement peut ne pas être suffisante pour traiter une piqûre de méduse."
            },
            {
                "text": "Arroser avec du vinaigre de table et ensuite placer la zone atteinte dans de l'eau chaude",
                "isCorrect": true,
                "comment": "Correct. L'application de vinaigre de table et d'eau chaude est une mesure recommandée pour traiter une piqûre de méduse."
            },
            {
                "text": "Utiliser un désinfectant pour nettoyer la plaie",
                "isCorrect": false,
                "comment": "Incorrect. Un désinfectant peut ne pas être suffisant pour neutraliser les toxines de la piqûre de méduse."
            },
            {
                "text": "Appliquer de la glace directement sur la piqûre",
                "isCorrect": false,
                "comment": "Incorrect. La glace peut aggraver la douleur et la brûlure causées par la piqûre de méduse."
            }
        ]
    },
    {
        "text": "Quelle action ne doit jamais être effectuée en cas de morsure de serpent ?",
        "answers": [
            {
                "text": "Aspiration de la plaie",
                "isCorrect": true,
                "comment": "Correct. L'aspiration de la plaie peut aggraver l'envenimation en favorisant la propagation du venin."
            },
            {
                "text": "Application d'un garrot",
                "isCorrect": false,
                "comment": "Incorrect. L'application d'un garrot peut être utile pour ralentir la propagation du venin, mais ce n'est pas la réponse spécifique à cette question."
            },
            {
                "text": "Nettoyage de la plaie avec de l'eau",
                "isCorrect": false,
                "comment": "Incorrect. Le nettoyage de la plaie est une mesure importante, mais il existe une action spécifique qui ne doit jamais être effectuée."
            },
            {
                "text": "Allongement de la victime et protection de la plaie par un pansement",
                "isCorrect": false,
                "comment": "Incorrect. Bien que cela puisse être recommandé dans certaines circonstances, il existe une action spécifique qui ne doit jamais être effectuée en cas de morsure de serpent."
            }
        ]
    },
    {
        "text": "Que recommande-t-on pour retirer une tique ?",
        "answers": [
            {
                "text": "Utiliser des ciseaux pour la retirer",
                "isCorrect": false,
                "comment": "Incorrect. Utiliser des ciseaux peut entraîner une pression sur la tique, ce qui peut provoquer l'injection de plus de toxines dans la plaie."
            },
            {
                "text": "Utiliser un \"tire-tique\" pour la retirer sans écraser l'animal",
                "isCorrect": true,
                "comment": "Correct. Un \"tire-tique\" est conçu pour retirer les tiques sans écraser leur corps, ce qui peut réduire le risque d'injection de toxines."
            },
            {
                "text": "Laisser la tique se détacher d'elle-même",
                "isCorrect": false,
                "comment": "Incorrect. Attendre que la tique se détache d'elle-même peut prendre du temps, pendant lequel elle peut continuer à injecter des toxines."
            },
            {
                "text": "Appliquer de la glace pour la faire partir",
                "isCorrect": false,
                "comment": "Incorrect. La glace ne fera pas partir la tique et peut même rendre plus difficile son retrait."
            }
        ]
    },
    {
        "text": "Pourquoi est-il important de retirer les bagues et bracelets à proximité d'une morsure ?",
        "answers": [
            {
                "text": "Pour éviter les réactions allergiques",
                "isCorrect": false,
                "comment": "Incorrect. Le retrait des bijoux n'est pas lié à la prévention des réactions allergiques."
            },
            {
                "text": "Pour faciliter le nettoyage de la plaie",
                "isCorrect": false,
                "comment": "Incorrect. Bien que le nettoyage de la plaie soit important, ce n'est pas la principale raison du retrait des bijoux."
            },
            {
                "text": "Pour éviter l'interruption de la circulation en cas de gonflement",
                "isCorrect": true,
                "comment": "Correct. En cas de gonflement, les bijoux peuvent exercer une pression supplémentaire, ce qui peut compromettre la circulation sanguine."
            },
            {
                "text": "Pour empêcher la propagation de l'infection",
                "isCorrect": false,
                "comment": "Incorrect. Le retrait des bijoux n'est pas directement lié à la prévention de l'infection."
            }
        ]
    },
    {
        "text": "Quelle est la première mesure recommandée en cas de contact avec la salive d'un animal errant ?",
        "answers": [
            {
                "text": "Consulter un vétérinaire",
                "isCorrect": false,
                "comment": "Incorrect. La première mesure recommandée est d'obtenir un avis médical pour évaluer le risque de transmission de maladies."
            },
            {
                "text": "Se laver immédiatement avec de l'eau",
                "isCorrect": false,
                "comment": "Incorrect. Bien que se laver après un contact avec la salive d'un animal soit important, il existe une mesure plus spécifique à prendre en premier."
            },
            {
                "text": "Demander un avis médical",
                "isCorrect": true,
                "comment": "Correct. En cas de contact avec la salive d'un animal errant, il est recommandé de consulter un médecin pour évaluer le risque de transmission de maladies."
            },
            {
                "text": "Appliquer un désinfectant sur la peau",
                "isCorrect": false,
                "comment": "Incorrect. L'application d'un désinfectant est une mesure importante mais il existe une action plus spécifique à prendre en premier."
            }
        ]
    },
    {
        "text": "Quelle est la procédure recommandée pour traiter une piqûre de scorpion ?",
        "answers": [
            {
                "text": "Appliquer de la glace",
                "isCorrect": false,
                "comment": "Incorrect. La glace peut ne pas être efficace pour traiter une piqûre de scorpion."
            },
            {
                "text": "Aspirer le venin",
                "isCorrect": false,
                "comment": "Incorrect. L'aspiration du venin peut aggraver la plaie en favorisant la propagation du venin."
            },
            {
                "text": "Placer la zone atteinte dans de l'eau chaude",
                "isCorrect": true,
                "comment": "Correct. Placer la zone affectée dans de l'eau chaude peut aider à soulager la douleur causée par la piqûre de scorpion."
            },
            {
                "text": "Appliquer un bandage serré autour de la plaie",
                "isCorrect": false,
                "comment": "Incorrect. Un bandage serré peut aggraver la douleur et augmenter le risque d'infection."
            }
        ]
    },
    {
        "text": "Quelle est la démarche à suivre en présence d'une morsure d'origine ?",
        "answers": [
            {
                "text": "Nettoyer la plaie avec de l'alcool",
                "isCorrect": false,
                "comment": "Incorrect. L'alcool peut irriter la plaie. Il est préférable de nettoyer avec de l'eau et du savon."
            },
            {
                "text": "Appliquer un pansement et surveiller l'état de la plaie",
                "isCorrect": false,
                "comment": "Incorrect. Bien qu'il soit important de surveiller l'état de la plaie, il existe une action spécifique à prendre en premier."
            },
            {
                "text": "Consulter immédiatement un médecin",
                "isCorrect": true,
                "comment": "Correct. En cas de morsure, il est recommandé de consulter immédiatement un médecin pour évaluer le risque d'infection et de transmission de maladies."
            },
            {
                "text": "Appliquer de la glace pour réduire l'inflammation",
                "isCorrect": false,
                "comment": "Incorrect. L'application de glace peut aider à réduire l'inflammation, mais il existe une action plus spécifique à prendre en premier."
            }
        ]
    },
    {
        "text": "Quelle est la recommandation en cas de persistance de la douleur ou du gonflement après une piqûre d'insecte ?",
        "answers": [
            {
                "text": "Appliquer une crème antiseptique",
                "isCorrect": false,
                "comment": "Incorrect. Une crème antiseptique peut ne pas être suffisante pour traiter la douleur persistante ou le gonflement après une piqûre d'insecte."
            },
            {
                "text": "Prendre des médicaments anti-inflammatoires",
                "isCorrect": false,
                "comment": "Incorrect. Bien que les anti-inflammatoires puissent être utiles, il existe une recommandation plus spécifique."
            },
            {
                "text": "Consulter un médecin",
                "isCorrect": true,
                "comment": "Correct. En cas de douleur ou de gonflement persistants après une piqûre d'insecte, il est recommandé de consulter un médecin pour évaluer la nécessité d'un traitement supplémentaire."
            },
            {
                "text": "Appliquer de la glace pendant plusieurs heures",
                "isCorrect": false,
                "comment": "Incorrect. Bien que l'application de glace puisse réduire l'inflammation, il existe une recommandation plus spécifique en cas de douleur ou de gonflement persistants."
            }
        ]
    },
    
    {
    "text": "16. Quel est le principal risque associé à une plaie par piqûre d'insecte ?",
    "answers": [
        {
            "text": "a) Une brûlure chimique",
            "isCorrect": false,
            "comment": "Incorrect. Les piqûres d'insectes ne sont généralement pas associées à des brûlures chimiques."
        },
        {
            "text": "b) Une infection de la plaie",
            "isCorrect": true,
            "comment": "Correct. Les piqûres d'insectes peuvent entraîner une infection de la plaie, en particulier si elles ne sont pas correctement nettoyées et traitées."
        },
        {
            "text": "c) Une fracture",
            "isCorrect": false,
            "comment": "Incorrect. Une piqûre d'insecte ne provoque généralement pas de fracture, sauf dans des circonstances très inhabituelles."
        },
        {
            "text": "d) Une déshydratation",
            "isCorrect": false,
            "comment": "Incorrect. La déshydratation n'est pas un risque courant associé aux piqûres d'insectes."
        }
    ]
    },
    {
      text: "Qu'est-ce que le malaise ?",
      answers: [
        { text: "Une sensation pénible traduisant un trouble du fonctionnement de l'organisme sans origine identifiée par la personne qui en est victime.", isCorrect: true, comment: "Le malaise est décrit comme une sensation désagréable associée à un dysfonctionnement corporel sans cause évidente." },
        { text: "Une réaction allergique grave qui met en jeu le pronostic vital.", isCorrect: false, comment: "Non, cela correspond plutôt à une réaction anaphylactique. Le malaise est plus général et ne se limite pas nécessairement à une réaction allergique." },
        { text: "Une détresse vitale imminente nécessitant une intervention médicale d'urgence.", isCorrect: false, comment: "Non, bien que certains malaises puissent être graves, tous les malaises ne sont pas des situations d'urgence vitale." },
        { text: "Un état de somnolence intense provoqué par une privation de sommeil.", isCorrect: false, comment: "Non, le malaise peut inclure la somnolence, mais il ne se résume pas à cela." }
      ]
    },
    {
      text: "Quelles sont les causes potentielles d'un malaise ou de l'aggravation d'une maladie ?",
      answers: [
        { text: "Modifications des conditions de vie telles que l'alimentation, l'exercice physique, le stress, les émotions, les traitements médicamenteux, ainsi que des problèmes de santé non connus.", isCorrect: true, comment: " Ces facteurs peuvent contribuer à un malaise ou à une aggravation de la maladie selon le contexte." },
        { text: "Exposition à des facteurs environnementaux extrêmes comme le froid ou la chaleur excessive.", isCorrect: false, comment: "Ces facteurs peuvent causer des problèmes de santé mais ne sont pas les seules causes de malaise selon le texte." },
        { text: "Contact avec des allergènes tels que les pollens, les aliments ou les médicaments.", isCorrect: false, comment: "Ces éléments sont plus spécifiquement liés aux réactions allergiques, bien que certaines réactions allergiques puissent également causer un malaise." },
        { text: "Exposition à des substances toxiques comme le monoxyde de carbone ou l'alcool.", isCorrect: false, comment: "Ces substances peuvent entraîner des problèmes de santé, mais elles ne sont pas toutes incluses dans la définition de malaise selon le texte." }
      ]
    },
    {
      text: "Quels sont les signes pouvant indiquer un malaise grave ?",
      answers: [
        { text: "Une détresse respiratoire, une paralysie transitoire, une difficulté à parler ou à bouger, une température cutanée élevée ou basse.", isCorrect: true, comment: " Ces signes peuvent être indicatifs d'un malaise grave selon le texte." },
        { text: "Des vomissements, une sensation de chaleur ou de froid, une fréquence cardiaque supérieure à 100 bpm ou inférieure à 40 bpm.", isCorrect: false, comment: "Certains de ces signes peuvent être associés à un malaise, mais ils ne sont pas tous spécifiques à un malaise grave selon le texte." },
        { text: "Une légère faiblesse musculaire, des picotements dans les extrémités, une bouche sèche.", isCorrect: false, comment: "Ces signes peuvent être présents lors d'un malaise, mais ils ne sont pas nécessairement indicatifs d'une situation grave." },
        { text: "Une légère pâleur, une transpiration excessive, une sensation de vertige.", isCorrect: false, comment: "Ces signes peuvent être présents lors d'un malaise, mais ils ne sont pas tous spécifiques à une situation grave." }
      ]
    },
    {
      text: "Que doit faire un secouriste en cas de malaise d'une victime consciente ?",
      answers: [
        { text: "Installer la victime dans une position confortable, aider la victime à dégrafer ses vêtements si nécessaire, surveiller la victime et demander un avis médical si nécessaire.", isCorrect: true, comment: " Ces actions sont recommandées pour aider une victime consciente en cas de malaise." },
        { text: "Administrer immédiatement un médicament si disponible, appeler les services d'urgence, vérifier la respiration de la victime.", isCorrect: false, comment: "Administrer un médicament peut être nécessaire dans certains cas, mais ce n'est pas la première étape recommandée pour un malaise conscient. De plus, vérifier la respiration n'est pas nécessaire si la victime est consciente et respire normalement." },
        { text: "Placer la victime en position latérale de sécurité, vérifier sa tension artérielle, administrer du sucre si elle est diabétique.", isCorrect: false, comment: "Placer la victime en position latérale de sécurité est approprié dans certains cas, mais ce n'est pas la seule action recommandée en cas de malaise conscient. Vérifier la tension artérielle n'est pas nécessaire en première intention, et administrer du sucre n'est indiqué que si une hypoglycémie est suspectée." },
        { text: "Demander à la victime de marcher pour faciliter la circulation sanguine, donner de l'eau pour éviter la déshydratation, appliquer des compresses froides sur le front.", isCorrect: false, comment: "Demander à la victime de marcher peut être contre-productif si elle se sent faible. Donner de l'eau peut être utile, mais ce n'est pas la seule action recommandée en cas de malaise. Appliquer des compresses froides peut aider à soulager certains symptômes, mais cela ne traite pas la cause sous-jacente du malaise." }
      ]
    },
    {
      text: "Quelles sont les mesures à prendre devant une réaction allergique grave ?",
      answers: [
        { text: "Soustraire la victime à l'allergène si possible, administrer un traitement si disponible, appliquer les gestes de secours appropriés selon la situation.", isCorrect: true, comment: "Correct ! Ces mesures sont recommandées pour gérer une réaction allergique grave." },
        { text: "Placer la victime en position de Trendelenburg, demander à la victime de respirer profondément, administrer un antihistaminique par voie orale.", isCorrect: false, comment: "Placer la victime en position de Trendelenburg peut aggraver certaines situations. Demander à la victime de respirer profondément n'est pas une mesure spécifique pour une réaction allergique grave. Administrer un antihistaminique par voie orale peut être approprié dans certains cas, mais ce n'est pas la première étape recommandée pour une réaction allergique grave." },
        { text: "Appliquer des compresses chaudes sur la zone touchée, masser doucement la zone affectée, éloigner la victime de toute source de chaleur.", isCorrect: false, comment: "Appliquer des compresses chaudes peut aggraver certains symptômes. Masser la zone touchée peut provoquer une diffusion plus rapide de l'allergène. Éloigner la victime de toute source de chaleur n'est pas spécifique à la gestion d'une réaction allergique grave." },
        { text: "Demander à la victime de prendre des médicaments antiallergiques, surveiller son pouls, lui administrer un antidote spécifique à l'allergène.", isCorrect: false, comment: "Demander à la victime de prendre des médicaments antiallergiques peut être approprié, mais ce n'est pas la première étape recommandée pour une réaction allergique grave. Surveiller le pouls est important, mais cela ne traite pas la cause sous-jacente du malaise. Administrer un antidote spécifique à l'allergène peut être nécessaire dans certains cas, mais ce n'est pas toujours disponible ni approprié en première intention." }
      ]
    },{
        text: "Qu'est-ce que l'hypoglycémie chez un diabétique et quelles en sont les principales causes ?",
        answers: [
          { text: "L'hypoglycémie est une baisse du taux de sucre dans le sang chez un diabétique, souvent causée par une alimentation inadaptée, un exercice physique inhabituel, un excès de traitement, la déshydratation ou la fièvre.", isCorrect: true, comment: "L'hypoglycémie chez un diabétique peut être due à plusieurs facteurs." },
          { text: "L'hypoglycémie est une augmentation du taux de sucre dans le sang chez un diabétique, causée par une alimentation excessive en sucre.", isCorrect: false, comment: "Non, l'hypoglycémie correspond à une baisse du taux de sucre dans le sang." },
          { text: "L'hypoglycémie est une condition normale chez les diabétiques et n'a pas de causes spécifiques.", isCorrect: false, comment: "Non, l'hypoglycémie est une condition à risque pour les diabétiques et peut avoir différentes causes." },
          { text: "L'hypoglycémie est une baisse du taux d'insuline dans le sang chez un diabétique, causée par une mauvaise absorption de l'insuline par l'organisme.", isCorrect: false, comment: "Non, l'hypoglycémie est une baisse du taux de sucre, pas d'insuline." }
        ]
      },
      {
        text: "Comment les diabétiques surveillent-ils leur taux de sucre sanguin et quel est l'outil utilisé à cet effet ?",
        answers: [
          { text: "Les diabétiques surveillent leur taux de sucre sanguin à l'aide d'une analyse d'urine.", isCorrect: false, comment: "Non, la mesure de la glycémie se fait généralement à partir d'une goutte de sang." },
          { text: "Les diabétiques surveillent leur taux de sucre sanguin à l'aide d'un lecteur de glycémie, qui mesure la glycémie à partir d'une goutte de sang prélevée au niveau du doigt.", isCorrect: true, comment: "Exact ! Le lecteur de glycémie est un outil essentiel pour les diabétiques."},
          { text: "Les diabétiques surveillent leur taux de sucre sanguin en mesurant leur tension artérielle.", isCorrect: false, comment: "Non, la mesure de la tension artérielle ne fournit pas d'informations sur le taux de sucre sanguin." },
          { text: "Les diabétiques surveillent leur taux de sucre sanguin en se basant uniquement sur leurs symptômes.", isCorrect: false, comment: "Non, il est important d'utiliser un dispositif de mesure pour obtenir des données précises." }
        ]
      },
      {
        text: "Quels sont les signes d'un malaise hypoglycémique chez un diabétique et comment peuvent-ils évoluer ?",
        answers: [
          { text: "Les signes d'un malaise hypoglycémique chez un diabétique sont uniquement une perte de connaissance et des convulsions.", isCorrect: false, comment: "Non, l'hypoglycémie peut se manifester par divers symptômes, pas seulement une perte de connaissance et des convulsions."},
          { text: "Les signes d'un malaise hypoglycémique chez un diabétique sont toujours les mêmes et n'évoluent jamais.", isCorrect: false, comment: "Non, les symptômes d'hypoglycémie peuvent varier d'une personne à l'autre et évoluer en fonction de la situation." },
          { text: "Les signes d'un malaise hypoglycémique chez un diabétique peuvent inclure une perte de connaissance, des convulsions, un trouble du comportement, des sueurs abondantes et une pâleur. Ces symptômes peuvent évoluer vers une détresse neurologique ou être suivis de plaintes telles que la faim, la fatigue, des palpitations et des tremblements.", isCorrect: true, comment: "Correct ! Les signes d'hypoglycémie chez un diabétique peuvent varier et évoluer en fonction de la gravité de la situation."  },
          { text: "Les signes d'un malaise hypoglycémique chez un diabétique sont uniquement une faiblesse musculaire et des vertiges.", isCorrect: false, comment: "Non, l'hypoglycémie peut entraîner différents symptômes, y compris ceux mentionnés, mais pas exclusivement." }
        ]
      },
      {
        text: "Quelle est la valeur seuil indiquant une hypoglycémie chez un diabétique, et quelles sont les unités de mesure utilisées pour la glycémie ?",
        answers: [
          { text: "Une victime est considérée en hypoglycémie si la valeur mesurée de la glycémie est < 10 mmol/l (ou < 180 mg/dl ou < 1,0 g/l).", isCorrect: false, comment: "Non, ces valeurs indiqueraient généralement une glycémie normale ou élevée, pas une hypoglycémie." },
          { text: "Une victime est considérée en hypoglycémie si la valeur mesurée de la glycémie est > 3,3 mmol/l (ou > 60 mg/dl ou > 0,6 g/l).", isCorrect: false, comment: "Non, une valeur supérieure indiquerait une hyperglycémie, pas une hypoglycémie." },
          { text: "Une victime est considérée en hypoglycémie si la valeur mesurée de la glycémie est > 10 mmol/l (ou > 180 mg/dl ou > 1,0 g/l).", isCorrect: false, comment: "Non, ces valeurs indiqueraient généralement une hyperglycémie, pas une hypoglycémie." },
          { text: "Une victime est considérée en hypoglycémie si la valeur mesurée de la glycémie est < 3,3 mmol/l (ou < 60 mg/dl ou < 0,6 g/l). Les unités de mesure de la glycémie sont le millimole par litre (mmol/l), le milligramme par décilitre (mg/dl) ou le gramme par litre (g/l).", isCorrect: true, comment: "Exact ! Ces valeurs seuils indiquent une hypoglycémie chez un diabétique, avec différentes unités de mesure possibles." }
        ]
      },
      {
        text: "Quelles sont les actions de secours à entreprendre en cas de perte de conscience chez un diabétique ?",
        answers: [
          { text: "En cas de perte de conscience chez un diabétique, appliquer la conduite à tenir adaptée, réaliser une mesure de glycémie capillaire lors du 4ème regard si la victime respire, et demander un avis médical.", isCorrect: true, comment: "Correct ! La sécurité de la victime et l'appel à un avis médical sont essentiels en cas de perte de conscience." },
          { text: "En cas de perte de conscience chez un diabétique, donner immédiatement du sucre à la victime et attendre son réveil.", isCorrect: false, comment: "Non, il est important de sécuriser la victime et d'obtenir un avis médical avant d'administrer du sucre, surtout si la cause de la perte de conscience n'est pas claire." },
          { text: "En cas de perte de conscience chez un diabétique, réaliser une mesure de tension artérielle et maintenir la victime dans une position confortable.", isCorrect: false, comment: "Non, la mesure de la tension artérielle n'est pas une priorité en cas de perte de conscience chez un diabétique." },
          { text: "En cas de perte de conscience chez un diabétique, administrer immédiatement de l'insuline à la victime pour augmenter son taux de sucre sanguin.", isCorrect: false, comment: "Non, l'administration d'insuline ne doit pas être effectuée en cas de perte de conscience sans avis médical, car cela peut aggraver la situation." }
        ]
      },
      {
        text: "Que doit faire un secouriste si une victime consciente présente des signes d'hypoglycémie ?",
        answers: [
          { text: "Si une victime consciente présente des signes d'hypoglycémie, le secouriste doit administrer immédiatement de l'insuline à la victime pour augmenter son taux de sucre sanguin.", isCorrect: false, comment: "Non, l'administration d'insuline ne doit pas être effectuée sans avis médical, car cela peut aggraver la situation." },
          { text: "Si une victime consciente présente des signes d'hypoglycémie, le secouriste doit réaliser une mesure de glycémie capillaire, aider la victime à prendre du sucre si nécessaire, demander un avis médical en cas de doute et surveiller la victime.", isCorrect: true, comment: "Correct ! Il est important d'évaluer la glycémie, d'administrer du sucre si nécessaire et de surveiller la victime en attendant un avis médical." },
          { text: "Si une victime consciente présente des signes d'hypoglycémie, le secouriste doit lui donner immédiatement du sucre sans réaliser de mesure de glycémie.", isCorrect: false, comment: "Non, il est important de mesurer la glycémie avant d'administrer du sucre pour éviter une hyperglycémie." },
          { text: "Si une victime consciente présente des signes d'hypoglycémie, le secouriste doit laisser la victime se reposer et attendre que les symptômes disparaissent d'eux-mêmes.", isCorrect: false, comment: "Non, il est nécessaire d'évaluer la glycémie et d'agir en conséquence pour traiter l'hypoglycémie." }
        ]
      },
      {
        text: "Quelle est la dose recommandée de sucre à donner à une victime consciente en cas d'hypoglycémie ?",
        answers: [
          { text: "La dose recommandée de sucre à donner à une victime consciente en cas d'hypoglycémie est une barre de chocolat.", isCorrect: false, comment: "Non, les barres de chocolat peuvent contenir d'autres ingrédients qui ne sont pas aussi efficaces que le sucre pur pour traiter l'hypoglycémie." },
          { text: "La dose recommandée de sucre à donner à une victime consciente en cas d'hypoglycémie est une cuillère à soupe de sucre.", isCorrect: false, comment: "Non, une dose plus importante est généralement recommandée pour traiter l'hypoglycémie." },
          { text: "La dose recommandée de sucre à donner à une victime consciente en cas d'hypoglycémie est de préférence du sucre en morceaux ou en poudre (4 morceaux ou cuillères à café de sucre), sinon une boisson sucrée comme un jus d'orange ou du miel. Pour les enfants, deux à trois morceaux ou cuillères à café de sucre sont recommandés.", isCorrect: true, comment: "Correct ! Ces doses sont recommandées pour aider à augmenter rapidement le taux de sucre sanguin." },
          { text: "La dose recommandée de sucre à donner à une victime consciente en cas d'hypoglycémie est une demi-cuillère à café de sucre.", isCorrect: false, comment: "Non, une dose plus importante est généralement nécessaire pour traiter efficacement l'hypoglycémie." }
        ]
      },
      {
        text: "Quelles mesures doivent être prises si une victime ne présente pas d'amélioration après avoir ingéré du sucre ?",
        answers: [
          { text: "Si une victime ne présente pas d'amélioration après avoir ingéré du sucre, il faut lui administrer un médicament anti-hypoglycémique.", isCorrect: false, comment: "Non, l'administration de médicaments ne doit pas être effectuée sans avis médical, car cela peut aggraver la situation." },
          { text: "Si une victime ne présente pas d'amélioration après avoir ingéré du sucre, il faut lui administrer de l'insuline pour augmenter son taux de sucre sanguin.", isCorrect: false, comment: "Non, l'administration d'insuline ne doit pas être effectuée sans avis médical, car cela peut aggraver la situation." },
          { text: "Si une victime ne présente pas d'amélioration après avoir ingéré du sucre, il faut lui donner de l'eau pour diluer le sucre dans son organisme.", isCorrect: false, comment: "Non, l'eau seule ne suffit pas à traiter l'hypoglycémie et peut diluer le sucre dans le sang, ce qui peut être dangereux." },
          { text: "Si une victime ne présente pas d'amélioration après avoir ingéré du sucre, une seconde dose de sucre peut être prise après environ 15 minutes. Si aucune amélioration ne survient au bout de 15 minutes suivant la deuxième dose de sucre, un avis médical doit être demandé.", isCorrect: true, comment: "Correct ! Il est important de surveiller la réaction de la victime et de demander un avis médical si les symptômes persistent." }
        ]
      },
      {
        text: "Pourquoi est-il important de demander un avis médical en cas de malaise hypoglycémique chez un diabétique ?",
        answers: [
          { text: "Il n'est pas nécessaire de demander un avis médical en cas de malaise hypoglycémique chez un diabétique, car il suffit généralement de prendre du sucre pour rétablir la situation.", isCorrect: false, comment: "Non, un avis médical peut être nécessaire pour évaluer la gravité de la situation et déterminer les mesures à prendre pour prévenir les récidives." },
          { text: "Il est important de demander un avis médical en cas de malaise hypoglycémique chez un diabétique pour évaluer la situation de manière professionnelle, déterminer la cause sous-jacente du malaise et fournir le traitement approprié si nécessaire.", isCorrect: true, comment: "Correct ! Un avis médical peut aider à identifier les causes sous-jacentes de l'hypoglycémie et à fournir un traitement approprié." },
          { text: "Il est important de demander un avis médical en cas de malaise hypoglycémique chez un diabétique pour éviter toute responsabilité légale en cas de complications.", isCorrect: false, comment: "Non, la principale raison de demander un avis médical est d'assurer le bien-être et la sécurité de la victime, pas uniquement pour des considérations légales." },
          { text: "Il n'est pas nécessaire de demander un avis médical en cas de malaise hypoglycémique chez un diabétique, car il s'agit généralement d'une situation bénigne qui peut être traitée à domicile.", isCorrect: false, comment: "Non, même si l'hypoglycémie peut être traitée à domicile, un avis médical peut être nécessaire pour évaluer la cause sous-jacente et prévenir les récidives." }
        ]
      },
      {
        text: "Quel est le délai d'attente recommandé entre l'ingestion de sucre et l'amélioration des symptômes chez une victime d'hypoglycémie ?",
        answers: [
          { text: "Il faut compter environ 10 à 15 minutes entre l'ingestion du sucre, une élévation de la glycémie et une amélioration des signes chez une victime d'hypoglycémie.", isCorrect: true, comment: "Correct ! Il est important de surveiller la réaction de la victime après avoir ingéré du sucre et de réagir en cas de besoin." },
          { text: "Il faut compter environ 30 minutes entre l'ingestion du sucre et une amélioration des symptômes chez une victime d'hypoglycémie.", isCorrect: false, comment: "Non, un délai aussi long pourrait indiquer une réponse insuffisante au traitement et nécessiter une intervention supplémentaire." },
          { text: "Il faut compter environ 5 minutes entre l'ingestion du sucre et une amélioration des symptômes chez une victime d'hypoglycémie.", isCorrect: false, comment: "Non, un délai aussi court peut être insuffisant pour observer une amélioration significative des symptômes." },
          { text: "Il n'y a pas de délai recommandé entre l'ingestion de sucre et l'amélioration des symptômes chez une victime d'hypoglycémie.", isCorrect: false, comment: "Non, il est important de surveiller la réaction de la victime après avoir ingéré du sucre pour déterminer si d'autres mesures sont nécessaires." }
        ]
      },{
        "text": "Qu'est-ce qu'un état de crise ?",
        "answers": [
            {
                "text": "Une réaction brusque et intense, de durée limitée, générant une souffrance aiguë difficile à contenir",
                "isCorrect": true,
                "comment": "Réponse correcte."
            },
            {
                "text": "Une manifestation contrôlée et régulière",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Une réaction progressive et stable face à un événement traumatisant",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Une condition permanente de détresse psychologique",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            }
        ]
    },
    {
        "text": "Quelles peuvent être les origines des troubles entraînant un état de crise ?",
        "answers": [
    
            {
                "text": "Uniquement des facteurs psychologiques",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Des facteurs physiques, psychologiques ou psychiatriques",
                "isCorrect": true,
                "comment": "Réponse correcte."
            },
            {
                "text": "Uniquement des facteurs physiques",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Des facteurs génétiques et héréditaires",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            }
        ]
    },
    {
        "text": "Qu'est-ce qui peut être considéré comme un facteur déclencheur externe d'un état de crise ?",
        "answers": [
            
            {
                "text": "Un changement interne à la personne",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Une affection psychiatrique permanente",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Un événement stressant, potentiellement traumatisant, exposant soudainement la personne à une menace de mort",
                "isCorrect": true,
                "comment": "Réponse correcte."
            },
            {
                "text": "Une réaction aiguë de la victime",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            }
        ]
    },
    {
        "text": "Quels sont les signes et manifestations qui peuvent indiquer un état de crise chez une personne ?",
        "answers": [
            
            {
                "text": "Seulement des signes physiques visibles",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Seulement des signes émotionnels intenses",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Des signes qui ne peuvent être observés que par des professionnels de santé",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Des signes et manifestations repérables dans différentes sphères : comportementales, émotionnelles et cognitives",
                "isCorrect": true,
                "comment": "Réponse correcte."
            },
        ]
    },
    {
        "text": "Comment peut réagir une victime en état de crise ?",
        "answers": [
            {
                "text": "Elle peut présenter une réaction de fuite panique ou une agitation désordonnée",
                "isCorrect": true,
                "comment": "Réponse correcte."
            },
            {
                "text": "Elle reste calme et posée, évaluant calmement la situation",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Elle est souvent incapable de bouger ou de parler",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Elle est parfaitement consciente de la réalité de la situation et prend des décisions rationnelles",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            }
        ]
    },
    {
        "text": "Quels sont les signes indiquant un état de panique chez une personne ?",
        "answers": [
           
            {
                "text": "Une capacité à raisonner calmement",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Une tension nerveuse avec apparition d'anxiété et d'agitation psychomotrice",
                "isCorrect": true,
                "comment": "Réponse correcte."
            },
            {
                "text": "Une réaction de recul par rapport à la situation",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Une expression calme et posée",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            }
        ]
    },
    {
        "text": "Quels sont les signes d'alerte indiquant un passage à l'acte violent ?",
        "answers": [
            
            {
                "text": "Respiration profonde et régulière",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Sourire et contact visuel apaisant",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Pâleur, augmentation de la coloration du visage, agitation",
                "isCorrect": true,
                "comment": "Réponse correcte."
            },
            {
                "text": "Immobilité et silence",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            }
        ]
    },
    {
        "text": "Quelle est la conduite à tenir spécifique face à un geste violent ?",
        "answers": [
           
            {
                "text": "Utiliser des gestes violents pour se défendre",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Ignorer la personne agressive jusqu'à ce qu'elle se calme",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Laisser la personne agressive seule pour qu'elle se calme d'elle-même",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Évaluer la dangerosité de la situation et mettre en sécurité les objets potentiellement dangereux",
                "isCorrect": true,
                "comment": "Réponse correcte."
            },
        ]
    },
    {
        "text": "Comment devrait être l'abord relationnel avec une personne agressive ?",
        "answers": [
            {
                "text": "Garder une distance de sécurité et rester calme et respectueux",
                "isCorrect": true,
                "comment": "Réponse correcte."
            },
            {
                "text": "Adopter une attitude agressive pour montrer de la fermeté",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Éviter tout contact verbal pour ne pas aggraver la situation",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Ignorer la personne agressive jusqu'à ce qu'elle se calme",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            }
        ]
    },
    {
        "text": "Quel est l'objectif principal de l'action de secours en termes de relation avec la victime ?",
        "answers": [
            
            {
                "text": "Éviter toute interaction avec la victime pour des raisons de sécurité",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Identifier les réactions inhabituelles et protéger la victime et son entourage",
                "isCorrect": true,
                "comment": "Réponse correcte."
            },
            {
                "text": "Réaliser des gestes médicaux complexes dès le début de l'intervention",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Encourager la victime à prendre des décisions autonomes",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            }
        ]
    },
    {
        "text": "Que recherche le secouriste lors de l'observation et de la recherche d'éléments auprès de la victime ?",
        "answers": [
            
            {
                "text": "Uniquement la cause externe de la crise",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Des éléments extérieurs perturbants la victime",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Des signes et des caractéristiques spécifiques, ainsi que des informations sur les antécédents, traitements et hospitalisations potentiels",
                "isCorrect": true,
                "comment": "Réponse correcte."
            },
            {
                "text": "Des informations sur les antécédents de la victime",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            }
        ]
    },
    {
        "text": "Quelle est la première étape pour déterminer les stratégies de protection et de prise en charge de la victime ?",
        "answers": [
            
            {
                "text": "Demander immédiatement l'intervention des forces de l'ordre",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Établir un contact verbal avec la victime",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Stabiliser l'état de crise de la victime",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Identifier les risques potentiels dans l'environnement",
                "isCorrect": true,
                "comment": "Réponse correcte."
            },
        ]
    },
    {
        "text": "Comment le secouriste devrait-il aborder une victime présentant une réaction de type hypoactive (silencieuse) ?",
        "answers": [
            {
                "text": "En cherchant à l'orienter vers des éléments sécurisants et des tâches simples",
                "isCorrect": true,
                "comment": "Réponse correcte."
            },
            {
                "text": "En s'exprimant de manière bruyante pour attirer son attention",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "En lui demandant de s'exprimer émotionnellement sur la situation",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "En lui proposant de réaliser des activités physiques pour la stimuler",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            }
        ]
    },
    {
        "text": "Quel est le premier pas à prendre face à une personne en crise suicidaire ?",
        "answers": [
            {
                "text": "Ignorer la situation et la laisser seule.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Reconnaître la souffrance de la personne et aborder la situation avec tact.",
                "isCorrect": true,
                "comment": "Réponse correcte."
            },
            {
                "text": "Agir de façon agressive pour la secouer.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Demander à d'autres personnes de s'en occuper.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            }
        ]
    },
    {
        "text": "Quelle est la meilleure façon d'évaluer le risque de passage à l'acte suicidaire ?",
        "answers": [
            {
                "text": "Poser des questions indirectes pour ne pas déranger la personne.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Ne pas aborder le sujet du tout pour ne pas aggraver la situation.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Poser des questions directes pour évaluer le moyen envisagé et sa disponibilité.",
                "isCorrect": true,
                "comment": "Réponse correcte."
            },
            {
                "text": "Proposer simplement à la personne de prendre des médicaments pour se calmer.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            }
        ]
    },
    {
        "text": "Que faut-il proposer systématiquement à une personne en crise suicidaire ?",
        "answers": [
            {
                "text": "Une intervention agressive pour la secouer.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "L'abandonner et la laisser seule.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Le transport vers l'hôpital pour une évaluation spécialisée.",
                "isCorrect": true,
                "comment": "Réponse correcte."
            },
            {
                "text": "Ignorer ses propos et changer de sujet.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            }
        ]
    },
    {
        "text": "Pourquoi est-il important de surveiller la personne en crise suicidaire pendant toute l'intervention ?",
        "answers": [
            {
                "text": "Pour la juger et la critiquer en cas de geste impulsif.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Pour prévenir tout passage à l'acte impulsif.",
                "isCorrect": true,
                "comment": "Réponse correcte."
            },
            {
                "text": "Pour l'ignorer et la laisser seule.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Pour minimiser ses propos et ses émotions.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            }
        ]
    },
    {
        "text": "Que faut-il rapporter à l'hôpital concernant une personne en crise suicidaire ?",
        "answers": [
            {
                "text": "Aucune information n'est nécessaire.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Les éléments observés et repérés lors de la prise en charge de la personne.",
                "isCorrect": true,
                "comment": "Réponse correcte."
            },
            {
                "text": "Rien, il suffit de laisser la personne seule.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Les éléments médicaux uniquement.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            }
        ]
    },{
        text: "Quels sont les types d'accidents pouvant entraîner une situation à nombreuses victimes selon le référentiel de secourisme ?",
        answers: [
          { text: "Accidents de trafic, incendies, effondrements de structures, accidents sociaux, actes de terrorisme, catastrophes naturelles, catastrophes technologiques, accidents infectieux.", isCorrect: true, comment: "Correct, ces sont les différents types d'accidents énumérés dans le référentiel." },
          { text: "Uniquement les accidents de trafic.", isCorrect: false, comment: "Il existe d'autres types d'accidents pouvant entraîner une situation à nombreuses victimes." },
          { text: "Uniquement les accidents de travail.", isCorrect: false, comment: "Les accidents de travail ne sont pas les seuls à entraîner des situations à nombreuses victimes." },
          { text: "Uniquement les catastrophes naturelles.", isCorrect: false, comment: "Les situations à nombreuses victimes ne sont pas limitées aux catastrophes naturelles." }
        ]
      },
      {
        text: "Quelles sont les conséquences caractérisant un accident entraînant de nombreuses victimes selon le référentiel de secourisme ?",
        answers: [
          { text: "La présence de dégâts matériels importants uniquement.", isCorrect: false, comment: "Les conséquences d'un accident à nombreuses victimes sont plus larges que seulement les dégâts matériels." },
          { text: "La présence de nombreuses victimes réelles ou potentielles, des dégâts matériels importants, une inadéquation initiale et temporaire entre les moyens disponibles et les besoins.", isCorrect: true, comment: "Correct, ces éléments caractérisent les conséquences d'un tel accident." },
          { text: "Uniquement la présence de nombreuses victimes réelles.", isCorrect: false, comment: "Les conséquences d'un tel accident vont au-delà de la présence de victimes." },
          { text: "Uniquement la présence de dégâts matériels importants et une inadéquation des moyens.", isCorrect: false, comment: "Cela ne couvre pas toutes les conséquences d'un accident à nombreuses victimes." }
        ]
      },
      {
        text: "Quels sont les principes d'action de secours recommandés dans une situation à nombreuses victimes ?",
        answers: [
          { text: "Assurer uniquement la sécurité et procéder rapidement à l'évacuation des victimes.", isCorrect: false, comment: "Il y a d'autres principes d'action à considérer." },
          { text: "Procéder à une reconnaissance rapide du site, assurer la sécurité, transmettre sans délai les informations recueillies, procéder au repérage des nombreuses victimes, réaliser les gestes de secours les plus urgents.", isCorrect: true, comment: "Correct, ces principes d'action sont recommandés dans une situation à nombreuses victimes." },
          { text: "Attendre l'arrivée des secours spécialisés sans intervenir.", isCorrect: false, comment: "Il est important d'agir rapidement en cas de situation à nombreuses victimes." },
          { text: "Procéder directement au sauvetage des victimes sans évaluer les dangers.", isCorrect: false, comment: "Assurer la sécurité est une priorité avant d'agir." }
        ]
      },
      {
        text: "Quel est le rôle des secouristes vis-à-vis des personnes non blessées mais affectées psychologiquement lors d'une situation à nombreuses victimes ?",
        answers: [
          { text: "Ne pas intervenir car ils ne sont pas blessés physiquement.", isCorrect: false, comment: "Les secouristes peuvent apporter un soutien aux personnes affectées psychologiquement." },
          { text: "Les diriger immédiatement vers les équipes spécialisées en psychologie.", isCorrect: false, comment: "Les secouristes peuvent également apporter un premier soutien psychologique." },
          { text: "Les regrouper au sein d'une zone dédiée aux impliqués et leur apporter une écoute réconfortante.", isCorrect: true, comment: "Correct, les secouristes peuvent jouer un rôle crucial dans le soutien psychologique des personnes affectées." },
          { text: "Les laisser se débrouiller seules.", isCorrect: false, comment: "Il est important d'offrir un soutien aux personnes affectées, même si elles ne sont pas blessées physiquement." }
        ]
      },
      {
        text: "Quelles sont les caractéristiques des dégâts matériels dans un accident entraînant de nombreuses victimes ?",
        answers: [
          { text: "Ils touchent principalement les bâtiments administratifs.", isCorrect: false, comment: "Les dégâts matériels peuvent affecter divers types de structures." },
          { text: "Ils peuvent engendrer des risques persistants pour les secouristes.", isCorrect: true, comment: "Correct, les dégâts matériels peuvent présenter des risques pour les secouristes." },
          { text: "Ils sont généralement limités aux véhicules.", isCorrect: false, comment: "Les dégâts matériels ne se limitent pas aux véhicules." },
          { text: "Ils n'ont pas d'impact sur les opérations de secours.", isCorrect: false, comment: "Les dégâts matériels peuvent influencer les opérations de secours." }
        ]
      },
      {
        text: "Quel est l'impact des dégâts matériels sur le sauvetage des victimes lors d'un accident à nombreuses victimes ?",
        answers: [
          { text: "Ils n'ont aucun impact sur le sauvetage des victimes.", isCorrect: false, comment: "Les dégâts matériels peuvent affecter le sauvetage des victimes." },
          { text: "Ils facilitent le sauvetage des victimes en fournissant des accès plus aisés.", isCorrect: false, comment: "Les dégâts matériels peuvent compliquer le sauvetage des victimes." },
          { text: "Ils peuvent avoir un impact sur le sauvetage des victimes en rendant l'accès difficile et en influençant la nature des gestes de secours à réaliser.", isCorrect: true, comment: "Correct, les dégâts matériels peuvent compliquer les opérations de secours." },
          { text: "Ils accélèrent le sauvetage des victimes en rendant l'intervention des secouristes plus efficace.", isCorrect: false, comment: "Les dégâts matériels peuvent ralentir le sauvetage des victimes en rendant l'accès plus difficile." }
        ]
      },
      {
        text: "Quelle est l'importance de l'organisation des secours dans une situation à nombreuses victimes ?",
        answers: [
          { text: "Elle n'est pas importante, car chaque secouriste peut agir individuellement.", isCorrect: false, comment: "Une organisation efficace des secours est cruciale dans ce type de situation." },
          { text: "Elle permet de limiter les effets du sinistre en coordonnant les interventions et en optimisant les ressources disponibles.", isCorrect: true, comment: "Correct, une bonne organisation des secours est essentielle pour gérer efficacement une situation à nombreuses victimes." },
          { text: "Elle ne concerne que les secours professionnels, pas les secouristes volontaires.", isCorrect: false, comment: "Tous les intervenants, qu'ils soient professionnels ou volontaires, doivent être intégrés dans l'organisation des secours." },
          { text: "Elle n'est importante que pour les autorités compétentes, pas pour les secouristes sur le terrain.", isCorrect: false, comment: "Les secouristes sur le terrain doivent également comprendre et respecter l'organisation des secours." }
        ]
      },
      {
        text: "Quelles sont les caractéristiques des victimes dans une situation à nombreuses victimes selon le référentiel de secourisme ?",
        answers: [
          { text: "Elles sont toutes blessées de manière visible.", isCorrect: false, comment: "Les victimes peuvent avoir des blessures visibles ou non." },
          { text: "Certaines peuvent être accessibles immédiatement, d'autres peuvent être enfouies ou emprisonnées.", isCorrect: true, comment: "Correct, les victimes peuvent présenter une variété de situations d'accessibilité." },
          { text: "Toutes présentent des blessures internes dues à une explosion.", isCorrect: false, comment: "Les blessures des victimes peuvent avoir différentes origines." },
          { text: "Elles sont toutes dans un état de choc psychologique sévère.", isCorrect: false, comment: "Le choc psychologique peut varier d'une victime à l'autre." }
        ]
      },
      {
        text: "Quel est le rôle des secouristes vis-à-vis des victimes en arrêt cardiaque ou décédées lors d'une situation à nombreuses victimes ?",
        answers: [
          { text: "Les ignorer car ils sont focalisés sur le sauvetage des victimes vivantes.", isCorrect: false, comment: "Les secouristes doivent également prendre en compte les victimes en arrêt cardiaque ou décédées." },
          { text: "Les traiter en priorité car leur état est plus grave que celui des autres victimes.", isCorrect: false, comment: "Les secouristes doivent prioriser les interventions en fonction de la gravité des blessures." },
          { text: "Les prendre en charge selon les protocoles appropriés et les dégager si possible pour libérer les ressources médicales.", isCorrect: true, comment: "Correct, les secouristes doivent suivre les protocoles pour les victimes en arrêt cardiaque ou décédées tout en priorisant les victimes vivantes." },
          { text: "Attendre l'arrivée des services de secours spécialisés avant d'intervenir.", isCorrect: false, comment: "Les secouristes doivent agir rapidement pour prendre en charge toutes les victimes." }
        ]
      },
      {
        text: "Quelle est l'importance de la reconnaissance rapide du site dans une situation à nombreuses victimes ?",
        answers: [
          { text: "Elle permet d'évaluer la gravité des blessures des victimes.", isCorrect: false, comment: "La reconnaissance du site ne concerne pas directement l'évaluation des blessures des victimes." },
          { text: "Elle permet de repérer les victimes plus rapidement.", isCorrect: true, comment: "Correct, une reconnaissance rapide du site permet d'identifier les zones les plus critiques et d'optimiser les interventions." },
          { text: "Elle n'est pas importante car les secouristes doivent agir immédiatement.", isCorrect: false, comment: "Une reconnaissance rapide du site est essentielle pour planifier et prioriser les interventions." },
          { text: "Elle permet d'identifier les causes de l'accident.", isCorrect: false, comment: "La reconnaissance du site vise principalement à évaluer la situation et à planifier les interventions." }
        ]
      },

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
  /*
  // creating questions
  for (var i = 0; i < 5; i++) {
    let question = new Question({
      text: questionsData[i].text,
      answers: questionsData[i].answers
    });
  
    appContainer.appendChild(question.create());
    questions.push(question);
  }*/
  
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

  // Demander à l'utilisateur le nombre de questions souhaitées
let numberOfQuestions = prompt("Combien de questions souhaitez-vous dans le quiz ?");

// Assurez-vous que numberOfQuestions est un nombre valide
numberOfQuestions = parseInt(numberOfQuestions);
if (isNaN(numberOfQuestions) || numberOfQuestions <= 0) {
  alert("Veuillez entrer un nombre valide de questions.");
} else {
  // Assurez-vous que numberOfQuestions ne dépasse pas la quantité de questions disponibles
  numberOfQuestions = Math.min(numberOfQuestions, questionsData.length);

  // Réinitialiser les tableaux pour stocker les nouvelles questions
  questions = [];
  appContainer.innerHTML = "";
  answeredQuestions = 0;
  score = 0;

  // Créer les questions
  shuffle(questionsData); // Mélanger les données des questions
  for (let i = 0; i < numberOfQuestions; i++) {
    let question = new Question({
      text: questionsData[i].text,
      answers: questionsData[i].answers
    });
    appContainer.appendChild(question.create());
    questions.push(question);
  }

  // Mettre à jour le score initial
scoreContainer.innerHTML = `Score: ${score}/${numberOfQuestions}`;
}
  
  console.log(questions, questionsData);
  