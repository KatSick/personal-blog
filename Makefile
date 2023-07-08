deploy:
	pnpm build
	rsync -av dist/ rsync://patso@blog-upload.katsick.cloud/volume