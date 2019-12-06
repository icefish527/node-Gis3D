FROM node:10.13-alpine
RUN mkdir -p /home/www/express
WORKDIR /home/www/express

COPY . /home/www/express

RUN npm install

EXPOSE 3000 4000
ENTRYPOINT ["npm", "run"]
CMD ["start"]