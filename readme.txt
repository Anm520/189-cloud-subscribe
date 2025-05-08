npx ncc build src/index.js -o cloud-node-dist
CRYPTO_SECRET_KEY  config.js 记得改，加密密钥

 2. 打包docker镜像命令
 docker build -t 189-cloud-subscribe .
 docker save -o 189-cloud-subscribe.tar 189-cloud-subscribe
3.运行容器命令
 docker run -d -p 8085:80 --name 189-cloud-subscribe-serve 189-cloud-subscribe
