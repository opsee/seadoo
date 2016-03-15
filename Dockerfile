FROM opsee/nginx

MAINTAINER Greg Poirier <greg@opsee.co>

EXPOSE 9102

RUN mkdir -p /app
COPY robots.txt dist /app/
RUN mkdir -p /app/nginx
COPY nginx /app/nginx/

RUN rm -f /etc/nginx/conf/nginx.conf
RUN ln -s /app/nginx/nginx.conf /etc/nginx/conf/nginx.conf