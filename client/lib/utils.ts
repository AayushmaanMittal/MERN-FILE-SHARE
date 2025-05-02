import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

export function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function getFileIcon(filename: string) {
  const extension = filename.split(".").pop()?.toLowerCase() || ""

  switch (extension) {
    case "pdf":
      return "file-text"
    case "doc":
    case "docx":
      return "file-text"
    case "xls":
    case "xlsx":
      return "file-spreadsheet"
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return "image"
    case "zip":
    case "rar":
      return "archive"
    case "mp3":
    case "wav":
      return "file-audio"
    case "mp4":
    case "avi":
    case "mov":
      return "file-video"
    default:
      return "file"
  }
}

export function getFileTypeClass(filename: string) {
  const extension = filename.split(".").pop()?.toLowerCase() || ""

  switch (extension) {
    case "pdf":
      return "pdf"
    case "doc":
    case "docx":
      return "doc"
    case "xls":
    case "xlsx":
      return "xls"
    case "jpg":
    case "jpeg":
    case "png":
      return "jpg"
    case "gif":
      return "jpg"
    case "zip":
    case "rar":
      return "zip"
    default:
      return "default"
  }
}

export function truncateString(str: string, num: number) {
  if (str.length <= num) {
    return str
  }
  return str.slice(0, num) + "..."
}
