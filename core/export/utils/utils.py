def batch_generator(data, size=75):
    for i in range(0, len(data), size):
        yield data[i : i + size]
