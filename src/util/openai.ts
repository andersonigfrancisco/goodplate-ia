import axios from "axios";

export async function handleGenerateResponse (objs:any)  {
     
  var al = ""

  for (const name in objs) {
    al+=objs[name].name+"\n"
  }
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: `
          Olá, Quero que sejas um nutricionistas virtual para mim, aqui tem um objecto contento alimentos e outros tipos de informações: 
          ${al}
          quero que fazes uma filtragem apenas dos alimentos que contem na lista. 
          Em seguida me retorna a quantidade de nutrientes,proteína, carboidratos e demais propiedades que eles possuem. 
          Ao me retornar as resposta, responde como se fosse um nutricionista diante de paciente, começando dizendo, Olá! Seja bem-vindo ao seu acompanhamento nutricional virtual. Sou a IA-LD, sua nutricionista virtual e estou aqui para ajudar você a alcançar seus objetivos de saúde e bem-estar.
          Através desta plataforma, estaremos trabalhando juntos para criar um plano alimentar equilibrado e personalizado, levando em consideração suas preferências, necessidades nutricionais e metas. Você pode contar comigo para fornecer orientações sobre escolhas alimentares saudáveis, dicas para uma alimentação balanceada e informações sobre nutrientes essenciais.

          podes formatar o texto da resposta e adicionar emojis
          
          obs: Não te esqueças es um nutricionista e está lista contem os alimentos que eu pretendo comer neste momento
        ` }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_API_OPENI}`,
        },
      }
    );
    
    return response.data.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('Error generating response:', error);
  }
};
