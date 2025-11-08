# Envia Invoice

> Aplicativo para automação de envio de invoice para a contabilidade após o recebimento do pagamento de serviços de software.
> - Esse aplicativo deve construir uma invoice baseado no template valor a ser pago, e a enviar via canal de comunicação
> (atualmente via email). 
> ### Invoice 
- O envio pode ser manual ou automatizado a partir do gatilho definido.
> - A invoice deverá ser enviada com o valor, o número, e a data corretos
>   - O valor deverá ser preenchido pelo gatilho (manual ou via interação por email)
>   - A data deve ser a data atual ou da data de recebimento do pagamento
>   - O número da invoice deve ser incrementado da última invoice enviada
>   - A invoice deverá receber dados do Recebedor e do Pagante, que não podem ser vazios.
>   - A invoice deverá receber dados bancários, que não podem ser vazios.
> ### Template
> - O template atual deve ser preenchido somente nos campos que serão alterados pela invoice, que são valor, número da invoice e data.
> - O template deve ser convertido de xlsx para PDF quando for enviado por email.
> - O template deve ser validado antes de enviado, para isso deve conter as informações básicas do cliente e do recebedor.
