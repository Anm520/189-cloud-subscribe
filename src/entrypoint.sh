#!/bin/sh

# 如果 src 目录为空，则复制初始代码
if [ -z "$(ls -A /code/src/)" ]; then
  echo "src 目录为空，正在初始化..."
  cp -r /code/src_init/* /code/src/
fi

# 启动服务
nginx -g 'daemon off;' & node ./index.js