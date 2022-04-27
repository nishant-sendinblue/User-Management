FROM nginx
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /build /usr/share/nginx/html