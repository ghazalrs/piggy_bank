export interface PopupScam {
  id: string;
  type: 'popup';
  title: string;
  message: string;
  icon: string;
  buttonText: string;
  dangerLevel: 'low' | 'medium' | 'high';
  explanation: string;
  redFlags: string[];
}

export interface CallScam {
  id: string;
  type: 'call';
  callerName: string;
  callerIcon: string;
  dialogue: {
    speaker: 'caller' | 'player';
    text: string;
    options?: {
      text: string;
      isSafe: boolean;
      response: string;
    }[];
  }[];
  dangerLevel: 'low' | 'medium' | 'high';
  explanation: string;
  redFlags: string[];
}

export type Scam = PopupScam | CallScam;

export const popupScams: PopupScam[] = [
  {
    id: 'prize-winner',
    type: 'popup',
    title: '🎉 YOU WON $500! 🎉',
    message: 'Congratulations! You won $500 cash! Just enter your bank account number to receive your prize money!',
    icon: '💵',
    buttonText: 'CLAIM MY MONEY!!!',
    dangerLevel: 'high',
    explanation: 'Real prizes NEVER ask for your bank account! Scammers use this to steal money FROM you instead of giving money TO you.',
    redFlags: [
      'Asks for bank account info',
      'You didn\'t enter any contest',
      'Too good to be true',
      'Rushes you to act fast'
    ]
  },
  {
    id: 'double-money',
    type: 'popup',
    title: '💰 DOUBLE YOUR MONEY! 💰',
    message: 'Send us $10 and we\'ll send you back $100! Limited time offer! Enter your payment app username!',
    icon: '🤑',
    buttonText: 'Get Rich Quick!',
    dangerLevel: 'high',
    explanation: 'Nobody can magically multiply your money! This is a trick to steal your $10 and your account info.',
    redFlags: [
      'Promises free money',
      'Asks you to send money first',
      'Wants your payment info',
      'Sounds too easy'
    ]
  },
  {
    id: 'gift-card-deal',
    type: 'popup',
    title: '🎁 GIFT CARD HACK! 🎁',
    message: 'Get FREE gift cards! Just share your parent\'s credit card number to verify your age!',
    icon: '💳',
    buttonText: 'Get Free Cards!',
    dangerLevel: 'high',
    explanation: 'NEVER share credit card numbers! This is a trick to steal money. Free gift cards don\'t need credit card "verification".',
    redFlags: [
      'Asks for credit card info',
      'Free items need payment info?',
      'Not from a real store',
      'Fake "age verification"'
    ]
  },
  {
    id: 'investment-scam',
    type: 'popup',
    title: '📈 KIDS INVEST APP! 📈',
    message: 'Turn your allowance into $1000! Download our app and connect your savings account to start!',
    icon: '💎',
    buttonText: 'Start Investing!',
    dangerLevel: 'high',
    explanation: 'Real investing takes time and has risks. Apps promising huge instant returns want to steal your savings!',
    redFlags: [
      'Promises huge returns',
      'Wants access to savings',
      'Unknown app',
      'Too good to be true'
    ]
  },
  {
    id: 'payment-app-scam',
    type: 'popup',
    title: '⚠️ ACCOUNT LOCKED! ⚠️',
    message: 'Your payment app is locked! Enter your PIN and password here to unlock it immediately!',
    icon: '🔒',
    buttonText: 'Unlock Now!',
    dangerLevel: 'high',
    explanation: 'Real apps NEVER ask for your password through popups! This is trying to steal your login to take your money.',
    redFlags: [
      'Asks for PIN and password',
      'Creates panic with "locked"',
      'Not from the real app',
      'Popups can\'t lock accounts'
    ]
  }
];

export const callScams: CallScam[] = [
  {
    id: 'bank-call',
    type: 'call',
    callerName: 'Your Bank',
    callerIcon: '🏦',
    dialogue: [
      {
        speaker: 'caller',
        text: 'Hello! This is your bank calling. We detected someone trying to steal money from your account! Quick, tell me your card number and PIN so I can protect your money!'
      },
      {
        speaker: 'player',
        text: '',
        options: [
          {
            text: 'Oh no! My card number is...',
            isSafe: false,
            response: 'Perfect! Now give me the PIN and I\'ll "protect" your account... 😈'
          },
          {
            text: 'I\'ll call my bank using the number on my card',
            isSafe: true,
            response: '*Click* The scammer hung up!'
          },
          {
            text: 'Let me ask my parent first',
            isSafe: true,
            response: '*Click* The scammer hung up because parents can spot scams!'
          }
        ]
      }
    ],
    dangerLevel: 'high',
    explanation: 'Real banks NEVER call and ask for your card number or PIN! They already have your info. Always hang up and call the number on your card!',
    redFlags: [
      'Banks never ask for PIN',
      'Creates panic about stolen money',
      'Caller ID can be faked',
      'Rushes you to share info'
    ]
  },
  {
    id: 'allowance-double',
    type: 'call',
    callerName: 'Money Helper',
    callerIcon: '💰',
    dialogue: [
      {
        speaker: 'caller',
        text: 'Hi kid! Want to double your allowance? Just send me your savings through a gift card, and I\'ll send back TWICE as much! It\'s a special deal just for you!'
      },
      {
        speaker: 'player',
        text: '',
        options: [
          {
            text: 'Wow! I\'ll get a gift card right now!',
            isSafe: false,
            response: 'Read me the code on the back and your money will be gone forever...'
          },
          {
            text: 'That sounds too good to be true',
            isSafe: true,
            response: '*Click* Smart kid! The scammer gave up!'
          },
          {
            text: 'I need to check with an adult',
            isSafe: true,
            response: '*Click* The scammer hung up fast!'
          }
        ]
      }
    ],
    dangerLevel: 'high',
    explanation: 'Nobody can magically double your money! Once you give away gift card codes, your money is GONE forever and can\'t be traced!',
    redFlags: [
      'Promises free money',
      'Wants gift card codes',
      'Too good to be true',
      'Stranger calling about money'
    ]
  },
  {
    id: 'payment-app',
    type: 'call',
    callerName: 'Payment App Support',
    callerIcon: '📱',
    dialogue: [
      {
        speaker: 'caller',
        text: 'This is Payment App security! Someone is trying to steal from your account RIGHT NOW! Give me your password so I can stop them and save your money!'
      },
      {
        speaker: 'player',
        text: '',
        options: [
          {
            text: 'Hurry! My password is...',
            isSafe: false,
            response: 'Thanks! Now I\'ll "protect" your account by taking all your money...'
          },
          {
            text: 'Real apps never ask for passwords on calls',
            isSafe: true,
            response: '*Click* You\'re right! The scammer hung up!'
          },
          {
            text: 'I\'m telling an adult about this',
            isSafe: true,
            response: '*Click* The scammer vanished!'
          }
        ]
      }
    ],
    dangerLevel: 'high',
    explanation: 'Real payment apps NEVER call and ask for your password! They have secure ways to protect your account without needing your password.',
    redFlags: [
      'Asks for password on phone',
      'Creates panic about theft',
      'Real apps don\'t call kids',
      'Rushes you to act now'
    ]
  },
  {
    id: 'gift-card-winner',
    type: 'call',
    callerName: 'Prize Center',
    callerIcon: '🎁',
    dialogue: [
      {
        speaker: 'caller',
        text: 'You won $1000! To claim your prize money, just buy a $50 gift card and read me the code. We\'ll send your $1000 right after!'
      },
      {
        speaker: 'player',
        text: '',
        options: [
          {
            text: 'Let me get the gift card!',
            isSafe: false,
            response: 'Read me those numbers and you\'ll never see that $50 again...'
          },
          {
            text: 'Real prizes don\'t cost money!',
            isSafe: true,
            response: '*Click* Exactly right! The scammer hung up!'
          },
          {
            text: 'I didn\'t enter any contest',
            isSafe: true,
            response: '*Click* The scammer couldn\'t answer that!'
          }
        ]
      }
    ],
    dangerLevel: 'high',
    explanation: 'You NEVER have to pay money to receive a prize! Real contests are free. Scammers take your gift card money and disappear!',
    redFlags: [
      'Must pay to get "free" money',
      'Wants gift card payment',
      'You didn\'t enter anything',
      'Sounds too good to be true'
    ]
  }
];

export function getRandomScam(): Scam {
  const allScams: Scam[] = [...popupScams, ...callScams];
  return allScams[Math.floor(Math.random() * allScams.length)];
}

export function getRandomPopupScam(): PopupScam {
  return popupScams[Math.floor(Math.random() * popupScams.length)];
}

export function getRandomCallScam(): CallScam {
  return callScams[Math.floor(Math.random() * callScams.length)];
}
