import axios from 'axios';

export async function translater (Obj:any)  {
  
  try {

    const translations : any = [];

    var cont =0;
    var lista = "";

    for (const key in Obj) {
      cont++;
      if (Obj.hasOwnProperty(key)) {

        const response = await axios.request(
          {
            method: 'POST',
            url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
            params: {
              'to[0]': 'pt',
              'api-version': '3.0',
              profanityAction: 'NoAction',
              textType: 'plain'
            },
            headers: {
              'content-type': 'application/json',
              'X-RapidAPI-Key': `${process.env.EXPO_PUBLIC_API_RAPI_API}`,
              'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
            },
            data: [
              {
                Text: Obj[key].name
              }
            ]
          }
        );
        
        translations[key] = {"key":cont,"name": response.data[0].translations[0].text, "percentage": Obj[key].percentage};
      }
    }
    console.log(lista)
    return translations;
  } catch (error) {
    console.error(error);
  }
};