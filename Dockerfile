# 使用官方的 Node.js 镜像作为基础镜像
FROM node:20-alpine AS build-stage

# 更换为国内镜像源
# RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 安装必要的依赖项
RUN apk add --update --no-cache ca-certificates
RUN apk add --update --no-cache python3 make g++ py3-setuptools

# 设置工作目录
WORKDIR /usr/src/app

# 设置 npm 镜像源
# ENV NPM_CONFIG_REGISTRY=https://registry.npmmirror.com

# 安装应用依赖
COPY package*.json ./

# 复制应用源代码
COPY ./src ./src

RUN npm install

# 第二阶段：生产阶段
FROM node:20-alpine AS production-stage

# 设置工作目录
WORKDIR /usr/src/app
# 更换为国内镜像源
# RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
# 安装Nginx
RUN apk add --update --no-cache nginx

# 移除默认的 Nginx 配置文件
RUN rm /etc/nginx/nginx.conf

# 复制新的 nginx.conf 文件到容器中
COPY ./nginx.conf /etc/nginx/nginx.conf
RUN nginx -t

# 复制新的 index.html 文件到镜像中
COPY ./cloud-vue-h5 /usr/share/nginx/html/cloud-vue-h5
COPY ./cloud-vue-pc /usr/share/nginx/html/cloud-vue-pc

# 复制从构建阶段生成的Node.js应用
COPY --from=build-stage /usr/src/app /usr/src/app

# 暴露端口 80
EXPOSE 80 

# 设置默认的命令
CMD ["sh", "-c", "nginx -g 'daemon off;' & node src/index.js"]