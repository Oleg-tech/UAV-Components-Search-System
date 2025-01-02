from main_parser import main_parser


def save_string_to_txt(text, file_path):
    with open(file_path, 'w') as file:
        file.write(text)


query = "TMotor F40 Pro"


def main():
    print("-----------Auto parser------------")
    main_parser(query=query)


if __name__ == '__main__':
    main()
